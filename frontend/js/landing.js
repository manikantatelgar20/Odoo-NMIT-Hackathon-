const canvas =
    document.getElementById("particles");

const ctx =
    canvas.getContext("2d");


let particles = [];


function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


function createParticles() {

    particles = [];

    const amount =
        window.innerWidth < 600
            ? 35
            : 90;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        particles.push({

            x:
                Math.random() *
                canvas.width,

            y:
                Math.random() *
                canvas.height,

            size:
                Math.random() *
                1.5 +
                .3,

            speed:
                Math.random() *
                .4 +
                .05,

            opacity:
                Math.random() *
                .5 +
                .1

        });

    }

}


function animateParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    particles.forEach(
        particle => {

            particle.y -=
                particle.speed;


            if (
                particle.y < 0
            ) {

                particle.y =
                    canvas.height;

            }


            ctx.beginPath();


            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    139,
                    92,
                    246,
                    ${particle.opacity}
                )`;


            ctx.fill();

        }
    );


    requestAnimationFrame(
        animateParticles
    );

}


resizeCanvas();

createParticles();

animateParticles();


window.addEventListener(
    "resize",
    () => {

        resizeCanvas();

        createParticles();

    }
);


/* MOUSE GLOW */

document.addEventListener(
    "mousemove",
    event => {

        const x =
            event.clientX;

        const y =
            event.clientY;


        document.body.style.setProperty(
            "--mouse-x",
            `${x}px`
        );


        document.body.style.setProperty(
            "--mouse-y",
            `${y}px`
        );

    }
);