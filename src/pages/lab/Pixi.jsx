import { Sprite, Stage, Text, Container } from '@pixi/react';

// Create a PixiJS application.
const Pixi = () => {
    return (
        <Stage options={{ background: "#3454d1" }}>
            <Sprite
                image="https://pixijs.io/pixi-react/img/bunny.png"
                x={400}
                y={270}
                anchor={{ x: 0.5, y: 0.5 }}
            />
            <Container x={400} y={330}>
                <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} />
            </Container>

        </Stage>)
}

export default Pixi

