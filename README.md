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

Two, both genuine:

| Project | Category | Photos |
|---|---|---|
| Sierras | New Builds | 1 main + 8 gallery |
| New Build Family Home | New Builds | 1 main |

There is deliberately no filler. The Projects page hides its category filter
until projects span at least two categories, so it never shows a filter with
one option.

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
404.html                Not-found page

assets/css/site.css     All styling for every page
assets/js/
  projects-data.js      >>> THE FILE YOU EDIT — all project content
  site.js               Navigation, project cards, lightbox
  home.js               Homepage "Our Work" preview
  projects-page.js      Projects listing + filters
  project-page.js       Individual project page

images/projects/        Project photographs, one folder per project
images/placeholder.svg  Shown wherever a photo hasn't been added yet
```

---

## Swapping the homepage hero photograph

The hero image is one `<img>` near the top of `index.html`:

```html
<div class="hero__media" aria-hidden="true">
  <img src="brock-contracts-project-newbuild.jpg" alt="" fetchpriority="high" decoding="async">
</div>
```

Drop a new file in and change that one `src`. It is decorative (the headline
carries the meaning), so `alt` stays empty. A wide landscape photograph works
best — the frame is full-bleed and crops to the viewport.

## Adding an exterior photo to an existing project

No different from any other photo. For a Sierras exterior:

1. Save it as `images/projects/sierras/exterior-01.jpg`.
2. Either add it to the `gallery` array, or make it the `mainImage` and move
   the current kitchen shot into the gallery.

The gallery lays itself out for any number of photos, so nothing else changes.

## Still to do

- Add a genuine client review (see the TESTIMONIAL comment in `index.html`;
  the styles are already written).
- Add a `<link rel="canonical">` to each page once the final domain is settled.
- Confirm whether Sierras and New Build Family Home are the same property.

---

## Testing locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening the HTML files directly with
`file://` will not work — the pages load their data with a script, which
browsers block on `file://`.
