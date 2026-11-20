# Putting hads.life on Cloudflare

This is a one-time setup, written for someone who has never used Cloudflare or GoDaddy. Total hands-on time is about 20 minutes, plus waiting for the domain to switch over (usually under an hour, at most 24 hours).

**What you end up with:** every push to the `main` branch on GitHub rebuilds and publishes the site automatically, served at https://hads.life with HTTPS. It costs nothing: Cloudflare's free plan serves static sites without limits. You keep paying GoDaddy only for the domain registration.

**Why "Workers" and not "Pages":** Cloudflare now recommends Workers for new sites. For a static site it behaves the same as Pages (free, global, automatic HTTPS) and it is where new features land.

**The order matters.** Parts 1 to 3 happen in Cloudflare. Part 4 is the only GoDaddy step. Part 5 is two short clicks back in Cloudflare, which can only happen after GoDaddy hands the domain over.

---

## Part 1. How deploys work

The Worker `hads-web` is live at **https://hads-web.joshirahul0925.workers.dev**.

Cloudflare's own Git integration (Workers Builds) watches `rahul-j0shi/hads-lifesciences`. Every push to `main` makes Cloudflare pull the code and run `npx wrangler deploy` at the top of the repository, which installs, builds and publishes the site. There is no GitHub Actions workflow and no token stored in GitHub.

## Part 2. Build settings (one time)

In Cloudflare open **Workers & Pages → hads-web → Settings → Build**:

| Setting | Value |
| --- | --- |
| Git repository | `rahul-j0shi/hads-lifesciences` |
| Branch (production) | `main` |
| Build command | empty |
| Deploy command | `npx wrangler deploy` |
| Root directory / path | empty or `/` |

Builds and their logs are listed under **hads-web → Deployments** (or a **Builds** tab).

## Part 3. Add hads.life to Cloudflare

1. Go back to the Cloudflare home screen (click the Cloudflare logo, top left) and choose **Add a domain** (it may be labelled **Onboard a domain**).
2. Type `hads.life`, keep **Quick scan for DNS records** selected, and click **Continue**.
3. Choose the **Free** plan at the bottom of the page and continue.
4. You will see a list of DNS records that Cloudflare copied from GoDaddy. **Delete** any record of type **A**, **AAAA** or **CNAME** whose name is `hads.life`, `@` or `www` (these point at GoDaddy's "parked domain" page and would block the site). Keep anything of type **MX** or **TXT**. If the list is empty, that is fine. Click **Continue to activation**.
5. Cloudflare now shows **two nameservers**, something like `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`. Yours will have different names. Copy both exactly and keep this tab open.

## Part 4. GoDaddy: point the domain at Cloudflare

This is the only change in GoDaddy. It tells the internet "Cloudflare now answers for hads.life".

1. Sign in at **https://www.godaddy.com**. Click your name (top right), then **My Products**.
2. Find `hads.life` under **Domains** and click **DNS** (or **Manage DNS**, or the domain name itself, then the **DNS** tab).
3. **Check DNSSEC first.** On the domain's settings page, look for **DNSSEC**. If it is **On**, turn it **Off** and save. (If it stays on, the domain stops working after the switch.) If you do not see DNSSEC, or it is already off, carry on.
4. Open the **Nameservers** tab and click **Change Nameservers**.
5. Choose **I'll use my own nameservers**. Remove whatever is there and enter the **two Cloudflare nameservers** from Part 3, one per box.
6. Click **Save**, and confirm the warning GoDaddy shows (it is warning you that GoDaddy's DNS settings will stop applying, which is what we want).
7. Go back to the Cloudflare tab and click **Check nameservers now** (or **I updated my nameservers**).

Cloudflare emails you when `hads.life` is **Active**. That usually takes 5 to 60 minutes, occasionally up to 24 hours. You can also watch the status on the Cloudflare home screen. Nothing breaks while you wait.

Your email keeps working: the site's contact address is a Gmail address, which does not depend on this domain.

## Part 5. Attach the domain to the site (after "Active")

1. In Cloudflare go to **Workers & Pages → hads-web → Settings → Domains & Routes**.
2. Click **Add → Custom domain**, type `hads.life`, and click **Add domain**. Cloudflare creates the DNS record and the HTTPS certificate for you.
3. Repeat for `www.hads.life`.
4. Send `www` to the main address so there is one canonical site: open the `hads.life` domain in Cloudflare, go to **Rules → Overview → Create rule → Redirect Rule**, choose the template **Redirect from WWW to root**, and click **Deploy**.
5. Under **SSL/TLS → Edge Certificates**, make sure **Always Use HTTPS** is on.

Wait a few minutes for the certificate, then open **https://hads.life** and **https://www.hads.life** (the second should land on the first). Done.

---

## Day to day

- **Change the site:** edit, run `./run.sh` to check locally, commit, push to `main`. Live in about a minute.
- **See deploys:** Cloudflare → Workers & Pages → hads-web → **Deployments**. **Roll back:** Cloudflare → Workers & Pages → hads-web → **Deployments**; any earlier version can be restored with one click.
- **Deploy from your laptop instead of GitHub (optional):** run `./run.sh --login` once, then `./run.sh --deploy`.

## If something goes wrong

| Symptom | Fix |
| --- | --- |
| A push to `main` does not deploy | Check **hads-web → Settings → Build**: the repository and branch must match Part 2. On GitHub, **Settings → Applications → Cloudflare Workers and Pages → Configure** must include `hads-lifesciences`. |
| A build fails | Open its log in Cloudflare. Then run `./run.sh --rebuild` locally: whatever fails there fails in Cloudflare too. |
| "Hostname already has externally managed DNS records" when adding the custom domain | In **DNS → Records**, delete the old A/AAAA/CNAME record for that name, then add the custom domain again. |
| Domain stuck on "Pending" for more than a day | In GoDaddy, confirm the nameservers are exactly the two Cloudflare ones and that DNSSEC is off. |
| Page loads but looks unstyled or stale | Hard refresh (Ctrl+Shift+R). HTML is never cached for long, so a new deploy shows up immediately. |
| You want visitor statistics | Cloudflare Web Analytics is free, but it loads a script from Cloudflare that the site's security policy currently blocks. Ask for the one-line change in `apps/web/public/_headers` before enabling it. |
