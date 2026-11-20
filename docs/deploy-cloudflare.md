# Putting hads.life on Cloudflare

This is a one-time setup, written for someone who has never used Cloudflare or GoDaddy. Total hands-on time is about 20 minutes, plus waiting for the domain to switch over (usually under an hour, at most 24 hours).

**What you end up with:** every push to the `main` branch on GitHub rebuilds and publishes the site automatically, served at https://hads.life with HTTPS. It costs nothing: Cloudflare's free plan serves static sites without limits. You keep paying GoDaddy only for the domain registration.

**Why "Workers" and not "Pages":** Cloudflare now recommends Workers for new sites. For a static site it behaves the same as Pages (free, global, automatic HTTPS) and it is where new features land.

**The order matters.** Parts 1 to 3 happen in Cloudflare. Part 4 is the only GoDaddy step. Part 5 is two short clicks back in Cloudflare, which can only happen after GoDaddy hands the domain over.

---

## Part 1. Put the code on GitHub

Cloudflare builds the site from your GitHub repository (`rahul-j0shi/hads-lifesciences`), so the latest code must be pushed there.

```bash
cd "/home/rahul/Desktop/New Folder/HADS"
git add -A
git commit -m "Rebuild site with Astro for Cloudflare"
git push origin main
```

## Part 2. Create a Cloudflare account and deploy

1. Go to **https://dash.cloudflare.com/sign-up**, sign up with your email, and verify the email address.
2. In the left sidebar choose **Compute (Workers) → Workers & Pages** (on some accounts it is just **Workers & Pages**).
3. Click **Create application**, then **Import a repository** (or **Connect to Git**). Choose **GitHub**.
4. A GitHub window opens asking you to install the **Cloudflare Workers and Pages** app. Choose **Only select repositories**, pick `hads-lifesciences`, and click **Install & Authorize**.
5. Back in Cloudflare, select the `hads-lifesciences` repository. A settings form appears. Cloudflare's form changes over time, so go by these rules rather than by its exact layout:

   - **Project name** (or Worker name): type `hads-web`. It must match `name` in the repository's `wrangler.jsonc`.
   - **Build command**: leave it **empty**. If it has something in it, delete it.
   - **Deploy command**: `npx wrangler deploy`. It is normally filled in already.
   - **Every other field** (root directory, path, environment variables, and so on): leave as it is, whether or not you see it.

   The repository is set up so that `npx wrangler deploy`, run from the top of the repository, installs everything, builds the site and publishes it. That is why no other setting is needed.
6. Click **Deploy** (or **Save and Deploy**). The first build takes 1 to 2 minutes; you can watch its log.
7. When it finishes, Cloudflare shows a link like `https://hads-web.<your-name>.workers.dev`. Open it: that is your live site, before the domain is attached.

If you already created the project with other settings: open **Workers & Pages → hads-web → Settings → Build**, make the build command empty and the deploy command `npx wrangler deploy`, save, then push any commit (or use **Retry build** on the latest deployment).

From now on, every push to `main` redeploys automatically. Pushes to other branches get their own preview link, so you can check a change before merging it.

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
- **See deploys or roll back:** Workers & Pages → hads-web → **Deployments**. Any earlier version can be restored with one click.
- **Deploy from your laptop instead of GitHub (optional):** run `./run.sh --login` once, then `./run.sh --deploy`.

## If something goes wrong

| Symptom | Fix |
| --- | --- |
| Build fails with "name mismatch" | The Cloudflare project name must be `hads-web`, the same as in `wrangler.jsonc` at the top of the repository. |
| Build fails with `Missing script: "build"` | The build command field is not empty. Clear it; the deploy command does the build. |
| Any other build failure | Run `./run.sh --rebuild` locally: whatever fails there fails in Cloudflare too. |
| "Hostname already has externally managed DNS records" when adding the custom domain | In **DNS → Records**, delete the old A/AAAA/CNAME record for that name, then add the custom domain again. |
| Domain stuck on "Pending" for more than a day | In GoDaddy, confirm the nameservers are exactly the two Cloudflare ones and that DNSSEC is off. |
| Page loads but looks unstyled or stale | Hard refresh (Ctrl+Shift+R). HTML is never cached for long, so a new deploy shows up immediately. |
| You want visitor statistics | Cloudflare Web Analytics is free, but it loads a script from Cloudflare that the site's security policy currently blocks. Ask for the one-line change in `apps/web/public/_headers` before enabling it. |
