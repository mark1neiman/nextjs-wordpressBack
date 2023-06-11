import { useEffect, useRef } from 'react';
import styles from './InteractiveBackground.module.scss';

const InteractiveBackground = ({ bubbleColor }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let shapes = [];
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (event) => {
            mouseX = event.clientX - canvas.offsetLeft;
            mouseY = event.clientY - canvas.offsetTop;
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createShapes = () => {
            shapes = [];

            for (let i = 0; i < 50; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = Math.random() * 30 + 10;
                const vx = (Math.random() - 0.5) * 4;
                const vy = (Math.random() - 0.5) * 4;

                shapes.push({ x, y, radius, vx, vy });
            }
        };

        const updateShapes = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            shapes.forEach((shape, index) => {
                // Move randomly
                shape.x += shape.vx;
                shape.y += shape.vy;

                // Move towards mouse
                const dx = mouseX - shape.x;
                const dy = mouseY - shape.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const angle = Math.atan2(dy, dx);
                    const force = (maxDistance - distance) / maxDistance;

                    shape.vx += Math.cos(angle) * force;
                    shape.vy += Math.sin(angle) * force;
                }

                // Limit speed
                const maxSpeed = 2; // Adjust the maxSpeed value to make the bubbles move slower
                shape.vx = Math.min(Math.max(shape.vx, -maxSpeed), maxSpeed);
                shape.vy = Math.min(Math.max(shape.vy, -maxSpeed), maxSpeed);

                // Bounce off walls
                if (shape.x < 0 || shape.x > canvas.width) {
                    shape.vx *= -1;
                }
                if (shape.y < 0 || shape.y > canvas.height) {
                    shape.vy *= -1;
                }

                // Collision detection with other bubbles
                for (let i = index + 1; i < shapes.length; i++) {
                    const otherShape = shapes[i];
                    const dx = otherShape.x - shape.x;
                    const dy = otherShape.y - shape.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = shape.radius + otherShape.radius;

                    if (distance < minDistance) {
                        // Calculate the normal vector
                        const nx = dx / distance;
                        const ny = dy / distance;

                        // Calculate the impact force
                        const force = (minDistance - distance) / minDistance;

                        // Update the velocities of the colliding bubbles
                        shape.vx -= nx * force;
                        shape.vy -= ny * force;
                        otherShape.vx += nx * force;
                        otherShape.vy += ny * force;
                    }
                }

                ctx.beginPath();
                ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
                ctx.fillStyle = bubbleColor; // Set bubble color from prop
                ctx.fill();
                ctx.closePath();
            });

            requestAnimationFrame(updateShapes);
        };


        handleResize();
        createShapes();
        updateShapes();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default InteractiveBackground;
