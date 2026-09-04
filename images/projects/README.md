# Project photographs

One folder per project, named to match the project's `slug` in
`assets/js/projects-data.js`:

```
images/projects/
  muthill-road-extension/
    main.jpg      <- the large hero image
    01.jpg        <- gallery photos
    02.jpg
```

**Before uploading:** resize to roughly 1600px on the long edge and save as
JPG. Photos straight off a phone are often 4–8 MB, which makes the site slow
on mobile data.

Any project without photos yet falls back to `images/placeholder.svg`
automatically, so nothing appears broken.
