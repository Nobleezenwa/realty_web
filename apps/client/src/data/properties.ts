import { Property } from '@/types'

export const properties: Property[] = [
    {
        id: 'p1',
        title: 'Modern Family Home',
        address: '742 Evergreen Terrace, Springfield',
        price: 420000,
        beds: 4,
        baths: 3,
        area: 2450,
        image: '/properties/p1.jpg',
        featured: true,
    },
    {
        id: 'p2',
        title: 'Cozy Country Cottage',
        address: '12 Willow Lane, Riverdale',
        price: 285000,
        beds: 3,
        baths: 2,
        area: 1680,
        image: '/properties/p2.jpg',
    },
    {
        id: 'p3',
        title: 'Downtown Loft Apartment',
        address: '801 Market St, Metropolis',
        price: 515000,
        beds: 2,
        baths: 2,
        area: 1320,
        image: '/properties/p3.jpg',
    },
]