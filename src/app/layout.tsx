import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Магазин мебели в Петрикове. Каталог мебели, рассрочка, продавцы, цены',
    description:
        'Ждем Вас в нашем мебельном магазине в Петрикове. Вы сможете купить мебель по отличным ценам с доставкой. Рассрочка, фото, акции и регулярные распродажи. Различных моделей по доступным ценам в наличии и под заказ.',
    keywords:
        'Петриков, купить мебель, рассрочка, акции, скидки, распродажа, магазины, мебельный магазин, каталог, каталог мебели, магазин мебели, скидки на мебель, мебель, маркет',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
