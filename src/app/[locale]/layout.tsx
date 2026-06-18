import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { CollectionProvider } from "@/context";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <CollectionProvider>{children}</CollectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
