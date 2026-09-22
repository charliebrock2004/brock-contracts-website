# Brock Contracts — website

Static website for Brock Contracts, joiners and building contractors, Crieff.
Deployed on Vercel from the `main` branch.

**There is no build step.** Edit a file, commit, push — Vercel redeploys.

---

## Adding a project

This is the only job you'll do regularly, and it's two steps.

### 1. Add the photos

Put them in a folder named after the project:

```
images/projects/muthill-road-extension/main.jpg
images/projects/muthill-road-extension/01.jpg
images/projects/muthill-road-extension/02.jpg
```

Before uploading, resize photos to about **1600px on the long edge** and save
as JPG. Straight off a phone they're often 4–8 MB each, which makes the site
slow to load on mobile data.

### 2. Add the project entry

Open **`assets/js/projects-data.js`**. Copy the `TEMPLATE` block at the bottom
of that file, paste it into the `PROJECTS` list, and fill it in:

```js
{
  slug: 'muthill-road-extension',        // becomes project.html?p=muthill-road-extension
  title: 'Two Storey Side Extension',
  location: 'Muthill, Perthshire',
  category: 'Extensions',                 // must match the CATEGORIES list
  featured: true,                         // show on the homepage
  completed: 'June 2026',
  summary: 'One or two sentences for the project card.',

  mainImage: {
    src: 'images/projects/muthill-road-extension/main.jpg',
    alt: 'Completed two storey side extension in Muthill'
  },

  description: [
    'First paragraph.',
    'Second paragraph.'
  ],

  details: [
    { label: 'Scope',    value: 'Extension, roofing, internal joinery' },
    { label: 'Duration', value: '14 weeks' }
  ],

  gallery: [
    { src: 'images/projects/muthill-road-extension/01.jpg', alt: 'Steels in place', caption: 'Steelwork installed' },
    { src: 'images/projects/muthill-road-extension/02.jpg', alt: 'Finished kitchen' }
  ]
}
```

Commit and push. The project now appears automatically on the homepage (if
`featured: true`), on the Projects page, in the right category filter, and on
its own page with a working photo gallery. **Nothing else needs editing.**

Newest projects go at the **top** of the list.

### Portrait photographs

Phone photos are often portrait. Add `ratio` to a gallery entry so the frame
matches the photograph and nothing is cropped:

```js
gallery: [
  { src: 'images/projects/garage/garage-01.jpg', ratio: '3x4', alt: '...' }
]
```

`3x4` is a standard phone portrait; `2x3` and `4x5` also work. Leave `ratio`
out for normal landscape photos. Portrait photos are never run full width in
the mosaic — at that size they would tower over everything else.

If a photo arrives sideways, it is carrying an EXIF rotation tag. Rotate it
before adding it so the file itself is the right way up.

### The gallery lays itself out

You don't choose which photos go large. The gallery is a two-column mosaic
that promotes roughly every fifth photo to full width, and it widens the last
photo if it would otherwise be left sitting alone in a half-width slot. That
works for any number of photos, so just list them in the order you want them
seen and the layout stays tidy.

Photo frames use a 3:2 ratio and `object-fit: cover`, so photos are never
stretched. Photos that are themselves 3:2 (most cameras) show with no cropping
at all. Gallery photos are lazy-loaded, so a project page with 20 photos still
loads quickly — only the main image loads up front.

### Only `slug`, `title`, `location`, `category` and `summary` are required

Everything else is optional. A project with no photos yet shows a
"photograph coming soon" placeholder rather than a broken image.

---

## The projects currently on the site

Four, all genuine:

| Project | Category | Photos |
|---|---|---|
| Garage Auchterarder (in progress) | New Builds | 1 main + 4 gallery |
| Flooring – Bridge of Allan | Flooring | 1 main + 4 gallery + video |
| Renovation Auchterarder | New Builds | 1 main + 8 gallery |
| New Build Dunkeld | New Builds | 1 main |

There is deliberately no filler. The Projects page hides its category filter
until projects span at least two categories, so it never shows a filter with
one option.

A project whose `details` include a `Status` row that is not "Completed" is
marked with that status on its card (the Garage shows "In progress"), so
unfinished work is never presented as done.

### Optional `isExample: true`

Setting this on a project marks it with an "Example" badge on its card and a
notice on its page, so a draft entry can never be mistaken for completed work.
No project uses it. Delete the flag when an entry holds a real project.

---

## Files

```
index.html              Homepage
projects.html           Projects listing, with category filters
project.html            Individual project page (reads ?p=slug)
about.html              About
contact.html            Contact, with the enquiry form
joiner-crieff.html      Joinery page
404.html                Not-found page

assets/css/site.css     All styling for every page (tokens at the top)
assets/fonts/           Self-hosted Instrument Serif + Instrument Sans,
                        with their SIL Open Font Licences
assets/js/
  projects-data.js      >>> THE FILE YOU EDIT — all project content
  site.js               Header, menu, project items, services, lightbox, motion
  home.js               Homepage "Recent projects"
  projects-page.js      Projects listing + filters
  project-page.js       Individual project page
  contact.js            Enquiry form (opens the visitor's email app)
  site-config.js        Business details for SEO tooling

images/projects/        Project photographs, one folder per project
images/site/            Photos sized and cropped for the homepage hero, the
                        services list and the "How we work" section
images/placeholder.svg  Shown wherever a photo hasn't been added yet
```

### The header and footer are in every page

There is no build step, so the header, menu and footer are written out in
each of the seven HTML files. If you change a link or a phone number there,
change it in all seven. (Search the project for the old text to find them.)

### Design tokens

Colours, type sizes and spacing are defined once at the top of `site.css`.
Components never name a colour directly: they use `--text`, `--bg`,
`--border` and `--accent`, and a section's surface class (`surface-stone`,
`surface-sand`, `surface-ink`) sets those. That is why a button or a label
is right on both light and dark sections without a separate version.

### The enquiry form

The site has no server, so the form on the contact page doesn't pretend to
send anything. It checks the name and message are filled in, then opens the
visitor's own email app with a tidy message to `c.brock016@btinternet.com`.
Nothing is sent until they press send there. If you later add a form service
(Formspree, Netlify Forms and so on), point the form's `action` at it and
remove `contact.js`.

## Swapping the homepage hero photograph

The hero photograph is the `<img>` inside `<figure class="hero__media">` near
the top of `index.html`. It is served at three sizes from `images/site/`
(`hero-joinery-640.jpg`, `-1024`, `-1600`) plus the original, so phones load
a small file. To change it, make the same three sizes of the new photo, update
the `src`, `srcset` and the matching `<link rel="preload">` in the `<head>`,
and write a new `alt` describing it. The caption link beside it names the
project the photo is from — update that too.

## Adding an exterior photo to an existing project

No different from any other photo. For an exterior of the Auchterarder renovation:

1. Save it as `images/projects/sierras/exterior-01.jpg`.
2. Either add it to the `gallery` array, or make it the `mainImage` and move
   the current kitchen shot into the gallery.

The gallery lays itself out for any number of photos, so nothing else changes.

## Still to do

- Add a genuine client review: the slot is in `index.html`, commented out
  (search for CLIENT REVIEW), and already styled.
- Canonical and Open Graph URLs assume the domain is `brockcontracts.co.uk`.
  If the live domain is different, change it in the `<head>` of each page and
  in `assets/js/site-config.js`.
- `sitemap.xml` lists pages that are not in the repository yet
  (`/builders-crieff`, `/extensions-crieff`, `/renovations-crieff`,
  `/kitchens-crieff`, `/doors-and-windows-crieff`, `/areas-we-cover`) and
  `/projects/<slug>` addresses that don't exist. Project pages live at
  `/project?p=<slug>`.
- Confirm whether Renovation Auchterarder and New Build Dunkeld are the same property.

---

## Testing locally

The pages link to each other with clean addresses (`/about`, `/projects`), as
Vercel serves them. A plain Python server can't do that, so use:

```bash
npx serve .
```

and open the address it prints. Opening the HTML files directly with
`file://` will not work.
