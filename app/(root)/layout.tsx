import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hospital Management System",
  description: "HMS - Patient, Doctor, and Admin Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    {children}
  );
}