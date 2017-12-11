# Image Carsouel 3D
There are two types of jQuery Plugin included.

1. `image-carousel-3d-builder.js` 
    Build DOM  using JSON for Carousel and init Carousel plugin.
2. `image-carousel-3d.js` 
    Use static HTML to build Carousel.

## Demo
http://oyeharry.github.io/image-carousel-3d/

## Usage

### Image Carousel 3D
`$("#imgCarousel3d").imgCarousel3d( { curIndex:2 } );`

### Image Carousel Builder
```
$("#imgCarousel3d").buildImgCarousel3d({
      dataFileUrl: '../build/data/image-carsouel-3d-data.json', 
      templateId: 'imgCarousel3dTemplate', //Hogan Template HTML ID
      assetPath: '../build/assets/' // assets path for images
});
```

## Options 
### Image Carousel Builder
| Property      | Defaults     | Descriptions                                            |
| :--------     | :--------    |:------------                                            |
| dataFile      | ''           | JSON File Name. Plugin will load JSON from dataPath     |
| dataFileUrl	| ''           | Full path of JSON File.                                 |
| dataPath      | ''           | dataFile will be loaded from this path.                 |
| assetPath     | ''           | Images will be loaded from this path.                   |
| jsonp		    | false        | Boolean value to load JSOP data                         |
| templateId    | ''           | Hogan Template ID to build DOM without #                | 
		
### Image Carousel
| Property                  | Defaults                     | Descriptions |
| :--------                 | :------------------------    | :----------- |
| curIndex	                | 0                            | Startup Image View Index   |
| radius                    | 960                          | Radius of Carousel         |
| borderColor               | 'rgba(220, 220, 220,0)'      | Inactive Images border color. It should be in RGBA format. |
| activeBorderColor		    | 'rgba(220, 220, 220,1)'      | Active Image border color. It should be in RGBA format.  |
| autoSlide                 | false                        | Bolean value. If true then carousel will start slideshow. | 
| autoSlideDelay            | 5                            | Auto slideshow wait time in seconds. | 
| loop                      | false                        | Boolean value. If true then carousel will go back to begining of image group when after the last image | 
| imgRotation               | true                         | Boolean value. If false then carousel will not rotate inactive images to 30 degree.| 
