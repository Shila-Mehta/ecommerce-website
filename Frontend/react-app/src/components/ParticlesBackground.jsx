import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            console.log("Particles Init:", engine); // should log
            await loadFull(engine);
        }).then(() => setInit(true));
    }, []);

    const options = useMemo(
        () => ({
            background: { color: "rgb(225, 78, 83)" },
            fpsLimit: 60,
            particles: {
                number: { value: 50 },
                color: { value: "#f7f0f0ff" },
                shape: { type: "circle" },
                opacity: { value: 1 },
                size: { value: { min: 2, max: 5 } },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    outModes: { default: "out" },
                },
                links: {
                    enable: true,   // particles connect with lines
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.5,
                    width: 1,
                },
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "repulse" }, // hover → particles move away
                    onClick: { enable: true, mode: "push" },    // click → new particles added
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 }, // adjust push-away effect
                    push: { quantity: 4 },                     // how many particles on click
                },
            },
            detectRetina: true,
        }),
        []
    );

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            options={options}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
            }}
        />
    );
}
