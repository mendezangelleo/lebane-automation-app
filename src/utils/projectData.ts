/**
 * Type definition for the Project Form Data.
 */
export type ProjectFormData = {
  projectName: string;
  currency: string;
  country: string;
  address: string;
  addressNumber: string;
  startDate: string;
  endDate: string;
  businessName: string;
  businessDocumentNumber: string;
  registrationDate: string;
  documentType: string;
  documentNumber: string;
};

type CountryConfig = {
  country: string;
  currencies: string[];
};

const COUNTRY_CONFIGS: CountryConfig[] = [
  { country: "Argentina", currencies: ["ARS"] },
];

const DOCUMENT_TYPES = ["CUIT", "CDI", "DNI"] as const;

/**
 * Helper to pick a random item from an array.
 */
function randomItem<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Helper to format a Date object to 'DD/MM/YYYY' string.
 */
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Generates random data for creating a new project.
 * Uses dynamic dates and random configurations to ensure test robustness.
 */
export function createRandomProjectData(): ProjectFormData {
  const timeSuffix = Date.now().toString().slice(-5);
  const randomNum = Math.floor(100000 + Math.random() * 900000).toString();

  const selectedConfig = randomItem(COUNTRY_CONFIGS);
  const selectedCurrency = randomItem(selectedConfig.currencies);
  const selectedDocType = randomItem(DOCUMENT_TYPES);

  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  return {
    projectName: `QA Auto Project ${selectedConfig.country} ${timeSuffix}`,
    country: selectedConfig.country,
    currency: selectedCurrency,

    address: "Calle Falsa",
    addressNumber: "123",

    startDate: formatDate(today),
    endDate: formatDate(nextYear),

    businessName: `QA Entity ${timeSuffix} SRL`,
    businessDocumentNumber: randomNum,
    registrationDate: formatDate(today),

    documentType: selectedDocType,
    documentNumber: randomNum,
  };
}
