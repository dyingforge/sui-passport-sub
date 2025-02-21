export type StickerData = {
    url: string
    rotation: number,
    size: number,
    name: string,
    top: number,
    left?: number,
    right?: number,
}

export const stickers: StickerData[] = [
    {
        url: '/images/walrus.png',
        rotation: -5,
        size: 240,
        name: 'North of walrus',
        top: 0,
        left: 134,
    },
    {
        url: '/images/cabo.png',
        rotation: 5,
        size: 240,
        name: 'Cabo',
        top: 252,
        left: 24,
    },
    {
        url: '/images/passport-pioneer.png',
        rotation: -5,
        size: 240,
        name: 'Passport Pioneer',
        top: 181,
        left: 357,
    },
    {
        url: '/images/cabo.png',
        rotation: -5,
        size: 240,
        name: 'Cabo',
        top: 13,
        right: 495,
    },
    {
        url: '/images/passport-pioneer.png',
        rotation: 5,
        size: 240,
        name: 'Passport Pioneer',
        top: 20,
        right: 64, 
    },
    {
        url: '/images/walrus.png',
        rotation: 5,
        size: 240,
        name: 'Passport Pioneer',
        top: 236,
        right: 230, 
    }
];