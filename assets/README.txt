NoteLab — asset folder guide
=============================

Drop your real files into these folders using these exact names
(or update the matching path in index.html if you rename them):

assets/apk/
  notelab.apk             -> your actual APK build

assets/images/
  logo.png                -> NoteLab logo, square, shows in the nav,
                             the logo ring at the top of the page,
                             and again above the final download button
  screenshot-1.jpg  to
  screenshot-12.jpg        -> the 12 app screenshots for the gallery
                             section, shown in a mixed grid
  video-cover.jpg          -> thumbnail shown before the demo video plays
  app-preview.jpg          -> the tall image in the About section
                             (use a 9:16 crop of any nice in-app screen)

assets/videos/
  demo.mp4                -> your walkthrough / demo video

Page flow (already built in, no need to reorder anything):
  1. Logo  ->  2. About  ->  3. Gallery (12 images)  ->
  4. Video  ->  5. Live status  ->  6. Download

That's it — once these files are in place the page works as-is.


Download counter — making it real for every student
=====================================================

Right now the counter only counts on each visitor's own browser
(it resets if they switch devices). To make it one real number
that every student sees, you need a small backend that stores a
number and increases it on each download. Two easy ways:

1. Free hosted counter service
   Use a free key-value service like Firebase Realtime Database
   or Supabase, create one row that holds a number, then point
   COUNTER_ENDPOINT in assets/script.js at the small API route
   you set up there (GET to read the count, POST to add 1).

2. Your own tiny endpoint
   If your hosting supports it, write a few lines of server code
   (PHP, Node, or a serverless function) that reads a number from
   a file or database, returns it on GET, and increases it by 1
   on POST. Then set COUNTER_ENDPOINT in assets/script.js, e.g.:

     const COUNTER_ENDPOINT = "https://yourdomain.com/api/count";

Until that's set up, the page still works fine — it just shows a
per-device count instead of a single shared one.
