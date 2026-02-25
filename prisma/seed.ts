import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const materialDefs = [
    { slug: 'yellow-gold', name: '18K Yellow Gold', color: '#D4AF37', metallic: 1, roughness: 0.2, price: 150 },
    { slug: 'white-gold', name: '18K White Gold', color: '#E8E8E8', metallic: 1, roughness: 0.15, price: 150 },
    { slug: 'rose-gold', name: '18K Rose Gold', color: '#B76E79', metallic: 1, roughness: 0.2, price: 0 },
    { slug: 'platinum', name: 'Platinum', color: '#E5E4E2', metallic: 1, roughness: 0.1, price: 500 },
]

const productDefs = [
    {
        sku: 'AM-RNG-001-48520', name: 'Éternité Diamond Ring', slug: 'eternite-diamond-ring',
        description: 'A timeless symbol of eternal love, featuring a brilliant-cut diamond set in lustrous gold. Handcrafted with precision to capture light from every angle.',
        price: 8500, category: 'rings', defaultMaterial: 'rose-gold', inStock: true, featured: true,
        images: JSON.stringify(['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800']),
        specifications: JSON.stringify({ weight: '4.2g', dimensions: 'Size 7 (customizable)', gemstone: 'Diamond', carats: '1.5ct', purity: '18K' }),
    },
    {
        sku: 'AM-NCK-002-73915', name: 'Céleste Necklace', slug: 'celeste-necklace',
        description: 'An exquisite statement piece inspired by celestial beauty. Delicate chain adorned with diamond accents that shimmer like stars.',
        price: 12500, category: 'necklaces', defaultMaterial: 'rose-gold', inStock: true, featured: true,
        images: JSON.stringify(['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800']),
        specifications: JSON.stringify({ weight: '12.8g', dimensions: '18 inches', gemstone: 'Diamond', carats: '2.5ct total', purity: '18K' }),
    },
    {
        sku: 'AM-BRC-003-62147', name: 'Royale Tennis Bracelet', slug: 'royale-tennis-bracelet',
        description: 'A classic tennis bracelet reimagined with modern elegance. Featuring perfectly matched diamonds in a continuous line of brilliance.',
        price: 15200, category: 'bracelets', defaultMaterial: 'white-gold', inStock: true, featured: true,
        images: JSON.stringify(['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800']),
        specifications: JSON.stringify({ weight: '18.5g', dimensions: '7 inches', gemstone: 'Diamond', carats: '5ct total', purity: '18K' }),
    },
    {
        sku: 'AM-ERR-004-31089', name: 'Aurora Drop Earrings', slug: 'aurora-drop-earrings',
        description: 'Elegant drop earrings that cascade with grace. Each piece captures and reflects light with mesmerizing brilliance.',
        price: 6800, category: 'earrings', defaultMaterial: 'rose-gold', inStock: true, featured: true,
        images: JSON.stringify(['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800']),
        specifications: JSON.stringify({ weight: '6.4g', dimensions: '1.5 inches drop', gemstone: 'Diamond', carats: '1.2ct total', purity: '18K' }),
    },
    {
        sku: 'AM-RNG-005-95403', name: 'Lumière Solitaire Ring', slug: 'lumiere-solitaire-ring',
        description: 'The epitome of classic elegance. A stunning solitaire diamond that commands attention with its exceptional clarity and cut.',
        price: 18900, category: 'rings', defaultMaterial: 'platinum', inStock: true, featured: false,
        images: JSON.stringify(['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800']),
        specifications: JSON.stringify({ weight: '5.1g', dimensions: 'Size 6 (customizable)', gemstone: 'Diamond', carats: '2.5ct', purity: 'Platinum 950' }),
    },
    {
        sku: 'AM-NCK-006-28764', name: 'Versailles Chain Necklace', slug: 'versailles-chain-necklace',
        description: 'Inspired by French royalty, this substantial chain necklace exudes power and sophistication. Perfect for making a bold statement.',
        price: 9200, category: 'necklaces', defaultMaterial: 'rose-gold', inStock: true, featured: false,
        images: JSON.stringify(['https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=800', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800']),
        specifications: JSON.stringify({ weight: '24.3g', dimensions: '20 inches', purity: '18K' }),
    },
]

async function main() {
    console.log('🌱 Seeding database...')

    const createdMaterials: Record<string, string> = {}
    for (const mat of materialDefs) {
        const created = await prisma.material.upsert({ where: { slug: mat.slug }, update: mat, create: mat })
        createdMaterials[mat.slug] = created.id
        console.log(`  ✅ Material: ${mat.name}`)
    }

    for (const prod of productDefs) {
        const { defaultMaterial, ...productData } = prod
        const created = await prisma.product.upsert({
            where: { slug: prod.slug },
            update: { ...productData, defaultMaterial },
            create: { ...productData, defaultMaterial },
        })
        for (const matSlug of Object.keys(createdMaterials)) {
            await prisma.productMaterial.upsert({
                where: { productId_materialId: { productId: created.id, materialId: createdMaterials[matSlug] } },
                update: {},
                create: { productId: created.id, materialId: createdMaterials[matSlug] },
            })
        }
        console.log(`  ✅ Product: ${prod.name}`)
    }
    console.log('\n🎉 Seeding complete!')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
