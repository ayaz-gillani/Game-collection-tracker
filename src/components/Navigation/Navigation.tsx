"use client";

import { useRouter, usePathname, Link } from "../../i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import styles from "./Navigation.module.css";
export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const handleLocaleChange = (newLocale: string) => {
    // Replace current locale in pathname with new locale
    console.log("Current pathname:", pathname, "locale:", locale);
    if (newLocale === locale) return;

    router.replace(pathname, {
      locale: newLocale,
    });
  };

  const isActive = (href: string) => pathname.includes(href);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logo}>Game Collection</div>

        <div className={styles.links}>
          <Link
            href={`/catalog`}
            className={`${styles.link} ${isActive("catalog") ? styles.active : ""}`}
          >
            {t("catalog")}
          </Link>
          <Link
            href={`/collection`}
            className={`${styles.link} ${isActive("collection") ? styles.active : ""}`}
          >
            {t("collection")}
          </Link>
        </div>

        <div className={styles.localeSwitch}>
          <button
            className={`${styles.localeButton} ${locale === "en" ? styles.active : ""}`}
            onClick={() => handleLocaleChange("en")}
          >
            EN
          </button>
          <button
            className={`${styles.localeButton} ${locale === "fr" ? styles.active : ""}`}
            onClick={() => handleLocaleChange("fr")}
          >
            FR
          </button>
        </div>
      </div>
    </nav>
  );
}
