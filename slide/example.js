/**
  JSUIKERS Meetup - Introduction to Famo.us
 */


define(function(require, exports, module) {
    var Engine             = require("famous/core/Engine");
    var Surface            = require("famous/core/Surface");
    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
    var Modifier = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");

    var RenderNode = require('famous/core/RenderNode');
    var Quaternion = require('famous/math/Quaternion');


    var mainContext = Engine.createContext();
    mainContext.setPerspective(1000);

    // The axis of the rotation is a Left Hand Rule vector with X Y Z (i j k) components
    var quaternion = new Quaternion(1, 0, 0, 0);
    var moveQuaternion = new Quaternion(185, 0, 0, 0);

      var rotationModifier = new Modifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
      });

       var currYPos = 0;
       var underTransition = false;
       var masterCounter = 0;

      // Bind the box's rotation to the quaternion
      rotationModifier.transformFrom(function() {


          return quaternion.getTransform();

      });


      // This is where the rotation is created
      Engine.on('prerender', function() {
        // You combine rotations through quaternion multiplication
        if(underTransition){
            masterCounter++
            quaternion = quaternion.multiply(moveQuaternion);
        //console.log('quaternion', quaternion);
            console.log(quaternion.y);
            console.log(masterCounter);

            if(masterCounter >= currYPos + 145){
                underTransition = false;
                currYPos = masterCounter;
            }
        }

      });

      Engine.on('keyup', function(e) {
        console.log('keyEvent',e.keyIdentifier);
        if(!underTransition && slidenum <= 6 && slidenum >= 1) {





            var x = quaternion.x;
            var y = quaternion.y;
            var z = quaternion.z;
            switch (e.keyIdentifier) {

              case 'Left':
                if(slidenum - 1 == 0) return;
                slidenum--;
                x = 0; y = 1; z = 0;
                underTransition = true;

                break;

              case 'Right':
                if(slidenum + 1 == 7) return;
                slidenum++;
                x = 0; y = -1; z = 0;
                underTransition = true;
                    //currYPos = Math.abs(quaternion.y);
                break;
            }

            switch(slidenum) {

                case 1:
                    slidesurf[1].setContent($('[data-slide="1"]').html());
                    break;
                case 2:
                    slidesurf[2].setContent($('[data-slide="2"]').html());
                    break;
                case 5:
                    slidesurf[1].setContent($('[data-slide="5"]').html());
                    break;
                case 6:
                    slidesurf[2].setContent($('[data-slide="6"]').html());
                    break;

            }

            moveQuaternion = new Quaternion(185, x, y, z);
        }
      });

      // Creates box renderable
      slidesurf = new Array();
      slidenum = 1;
      function createBox(width, height, depth) {
        var box = new RenderNode();

        function createSide(params,num){
          var surface = new Surface({
            size: params.size,
            content: params.content,
            classes: params.classes,
            properties: params.properties
          });

          var modifier = new Modifier({
            transform: params.transform
          });

          box.add(modifier).add(surface);
          slidesurf[num] = surface;
        }

        // Front
        createSide({
          size: [width, height],
          //content: '<h2>Hello World, let\'s get friendly.</h2><p>Take num lock off and use the keypad to arrow the cube rotation.</p>',
          content : $('[data-slide="1"]').html(),
          classes: ["red-bg"],
          properties: {
            backgroundColor: '##333',
            lineHeight: 25 + 'px',
            textSize: '20px',
            textAlign: 'left',
            overflow: 'auto',
            backgroundColor: '#555',
            overflow: 'hidden',
            //color: '#777'
          },
          transform: Transform.translate(0, 0, depth / 2)
        },1);

        // Back
        createSide({
          size: [width, height],
          //content: 'G\'bye world, Good to know you :D',
          content: $('[data-slide="3"]').html(),
          properties: {
            //lineHeight: height + 'px',
            textAlign: 'center',
            backgroundColor: '#FFF',
            fontSize: '18px',
            overflow: 'hidden',
            color: '#777'
          },
          transform: Transform.multiply(Transform.translate(0, 0, - depth / 2), Transform.multiply(Transform.rotateZ(Math.PI), Transform.rotateX(Math.PI))),
        },3);

        // Top

        // Bottom

        // Left
        createSide({
          size: [depth, height],
          //content: 'I\'m the Left! I\'m content',
          content : $('[data-slide="2"]').html(),
          properties: {
            lineHeight: 25 + 'px',
            //textAlign: 'center',
            backgroundColor: '#333',
            overflow: 'hidden',
            color: '#777'
          },
          transform: Transform.multiply(Transform.translate(-width / 2, 0, 0), Transform.rotateY(-Math.PI/2))
        },2);

        // Right
        createSide({
          size: [depth, height],
          //content: 'I\'m always Right!',
          content : $('[data-slide="4"]').html(),
          properties: {
            //lineHeight: 20 + 'px',
            //textAlign: 'center',
            backgroundColor: '#FFF',
            overflow: 'hidden',
            color: '#777',
          },
          transform: Transform.multiply(Transform.translate(width / 2, 0, 0), Transform.rotateY(Math.PI/2))
        },4);

        return box;
      }

    var layout = new HeaderFooterLayout({
        headerSize: 100,
        footerSize: 50
    });

    layout.header.add(new Surface({
        size: [undefined, 100],
        content: "<span style='font-size:40px;'>Bangalore Javascript UI Hackers</span>",
        classes: ["red-bg"],
        properties: {
            lineHeight: "100px",
            textAlign: "center"
        }
    }));



    layout.footer.add(new Surface({
        size: [undefined, 50],
        content: "21st March , 2015",
        classes: ["red-bg"],
        properties: {
            lineHeight: "50px",
            textAlign: "center"
        }
    }));

    mainContext.add(layout);


    layout.content.add(rotationModifier)
      .add(createBox(400, 400, 400));


});
