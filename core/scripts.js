export const scriptedActions = {
    smallshipFromLeft: [
        {
            time: 0,
            setters: {
                x: 0,
                y: 50,
                dx: 10,
                dy: 10
            }
        },
        {
            time: 50,
            setters: {
                dy: 0
            }
        }
    ]
};

export const gameScript = [
    250, 'smallshipFromLeft',
    450, 'smallshipFromLeft',
    650, 'smallshipFromLeft',
    850, 'smallshipFromLeft'
];
