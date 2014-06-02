#Image Carsouel 3D
There are two types of jQuery Plugin included.

1. `image-carousel-3d-builder.js` Build DOM  using JSON for Carousel and init Carousel plugin.
2. `image-carousel-3d.js` Use static HTML to build Carousel.

## Usage

###Image carousel 3D
`$("#imgCarousel3d").imgCarousel3d();`

###Image carousel with DOM builder using JSON
```
$("#imgCarousel3d").buildImgCarousel3d({
      dataFileUrl: '../build/data/image-carsouel-3d-data.json', 
      templateId: 'imgCarousel3dTemplate', //Hogan Template HTML ID
      assetPath: '../build/assets/' // assets path for images
});
```
