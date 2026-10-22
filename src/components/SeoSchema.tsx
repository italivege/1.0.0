import React from "react";

export default function SeoSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": "https://www.italive.ge/#organization",
    name: "ITalive — IT აუთსორსინგი და აიტი მომსახურება",
    alternateName: [
      "ITalive Georgia",
      "აიტი ელაივ",
      "IT Outsourcing Georgia",
      "აიტი აუთსორსინგი",
    ],
    url: "https://www.italive.ge",
    logo: "https://www.italive.ge/favicon.ico",
    description:
      "პროფესიონალური IT აუთსორსინგი, კომპიუტერული და ქსელური მომსახურება, სერვერების ადმინისტრირება, კიბერუსაფრთხოება (SIEM) და სრული ინფორმაციული ტექნოლოგიების მხარდაჭერა ბიზნესისთვის საქართველოში.",
    areaServed: [
      {
        "@type": "Country",
        name: "Georgia",
      },
      {
        "@type": "City",
        name: "Tbilisi",
      },
    ],
    knowsLanguage: ["ka", "en"],
    serviceType: [
      "IT აუთსორსინგი",
      "აიტი მომსახურება",
      "ინფორმაციული ტექნოლოგიები",
      "სერვერების გამართვა და ადმინისტრირება",
      "ქსელის მონტაჟი და კონფიგურაცია (Cisco / MikroTik)",
      "კიბერუსაფრთხოება და SIEM მონიტორინგი",
      "კომპიუტერული მომსახურება კომპანიებისთვის",
      "დისტანციური IT მხარდაჭერა (Helpdesk)",
      "Cloud ინფრასტრუქტურა (AWS)",
      "IT Outsourcing & Managed IT Services",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "IT აუთსორსინგი და ინფორმაციული ტექნოლოგიების სერვისები",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "სრული IT აუთსორსინგი კომპანიებისთვის (Managed IT Services)",
            description:
              "ორგანიზაციების კომპიუტერული პარკის, ოფისის ტექნიკის, Wi-Fi-ს და მომხმარებლების 24/7 ტექნიკური მხარდაჭერა.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "ქსელური ინფრასტრუქტურისა და სერვერების ადმინისტრირება",
            description:
              "კორპორატიული ქსელების დაპროექტება, Cisco/ファイアウォール კონფიგურაცია, Linux/Windows სერვერებისა და AWS ღრუბლოვანი სისტემების გამართვა.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "კიბერუსაფრთხოება და ITalive Guardian SIEM მონიტორინგი",
            description:
              "სერვერების, API-ებისა და კორპორატიული ქსელის 24/7 დაცვა, შეტევების პრევენცია (IDS/IPS/WAF) და უსაფრთხოების აუდიტი.",
          },
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "რას მოიცავს ITalive-ის IT აუთსორსინგი (აიტი მომსახურება)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ITalive გთავაზობთ სრულ IT აუთსორსინგს: კომპიუტერული სისტემების გამართვას, ქსელური ინფრასტრუქტურის (Wi-Fi, როუტერები, სვიჩები) კონფიგურაციას, Linux/Windows სერვერების ადმინისტრირებას, კორპორატიული მეილების გამართვას და 24/7 კიბერუსაფრთხოების მონიტორინგს.",
        },
      },
      {
        "@type": "Question",
        name: "რატომ არის მომგებიანი აიტი აუთსორსინგი ბიზნესისთვის?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "IT აუთსორსინგით კომპანია ზოგავს შტატში მყოფი IT სპეციალისტის ხარჯებს და იღებს სერტიფიცირებულ ინჟინერთა გუნდის მომსახურებას, სწრაფ დისტანციურ და ადგილზე რეაგირებას და უწყვეტ სამუშაო პროცესს.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}