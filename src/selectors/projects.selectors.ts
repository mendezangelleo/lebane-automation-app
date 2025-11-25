// src/selectors/projects.selectors.ts

export const projectsSelectors = {
  // --- Menu / Navigation ---

  menuButton: "button.MuiIconButton-root",

  // --- Upload logo ---

  uploadLogoClickable: 'div:has-text("Subir logo del proyecto")',

  // --- Project name ---

  projectNameInput: 'input[data-cy="new-renderer-field-nombreProyecto"]',

  // --- Autocomplete inputs ---

  currencyInput: 'input[data-cy="new-renderer-field-moneda"]',

  countryInput: 'input[data-cy="new-renderer-field-pais"]',

  stateInput: 'input[data-cy="new-renderer-field-estado"]',

  cityInput: 'input[data-cy="new-renderer-field-ciudad"]',

  constructionTypeInput: 'input[data-cy="new-renderer-field-tipoConstruccion"]',

  businessNameInput: 'input[placeholder="Escribí para buscar o crear"]',

  businessDocumentTypeInput:
    'input[data-cy="new-renderer-field-documentoDeIdentidadTipo"]',

  businessDocumentNumberInput:
    'input[data-cy="new-renderer-field-documentoDeIdentidadNumero"]',

  // Opciones de cualquier Autocomplete MUI

  autocompleteOptionExact: (value: string) =>
    `li[role="option"]:has-text("${value}")`,

  autocompleteFirstOption: 'li[role="option"]',

  // --- Address ---

  addressInput: 'input[data-cy="new-renderer-field-calle"]',

  addressNumberInput: 'input[data-cy="new-renderer-field-numeroPuerta"]',

  // --- Dates ---

  startDateInput: 'input[data-cy="new-renderer-field-fechaInicio"]',

  endDateInput: 'input[data-cy="new-renderer-field-fechaFin"]',

  // --- Client / other ---

  clientNameInput: 'input[name="nombre"]',

  registrationDateInput: 'input[name="registrationDate"]',

  documentTypeInput: 'select[name="documentType"]',

  documentNumberInput: 'input[name="documentNumber"]',

  // --- Buttons ---

  registerButton: 'button:has-text("Registrar")',

  // --- Feedback ---

  toastSuccess: "text=Creación exitosa",

  duplicateProjectErrorText: "text=Ya existe un proyecto con el nombre",
};
