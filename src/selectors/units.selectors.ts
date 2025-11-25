/**
 * Selectors for the Units management pages.
 * Organized by functionality (Navigation, Form, Table, etc.)
 */
export const unitsSelectors = {
  // ================= SIDEBAR & NAVIGATION =================

  comercialSidebarItem: 'li[role="button"] svg[data-cy="sidebar-comercial"]',

  comercialUnitsMenuItem: 'li[role="menuitem"] span:has-text("Unidades")',

  unitsTab: 'button[role="tab"]:has-text("Unidades")',

  // ================= UNIT CREATION FORM =================

  pricePerM2Input: 'input[name="precioListaMetroCuadrado"]',

  floorsInput: 'input[name="pisos"]',

  typologiesInput: 'input[data-cy="new-renderer-field-tipologias"]',

  unitsPerFloorInput: 'input[name="unidadesPorPiso"]',

  priceListNameInput: 'input[data-cy="new-renderer-field-versionListaPrecios"]',

  createUnitsButton: 'button[type="submit"]:has-text("Guardar")',

  // ================= UNITS TABLE =================

  unitRows: "tbody.MuiTableBody-root tr",

  firstRowDeleteButton:
    'tbody.MuiTableBody-root tr:first-child td[data-column-id="menu"] button',

  // ================= PRICE LIST MANAGEMENT =================

  priceListButton: 'button:has-text("Lista precios")',

  priceListOptionByName: (name: string) => `role=menuitem[name="${name}"]`,

  // ================= TEMPLATE UPLOAD =================

  templatesButton: 'span[aria-label="Templates"] button',

  uploadUnitsTemplateMenuItem: 'button:has-text("Cargar Template de Unidades")',

  uploadTemplateInput: "input#upload-template",

  uploadSubmitButton: 'button[type="submit"]:text-is("Cargar")',

  // ================= FEEDBACK / TOASTS =================

  unitsToastSuccess: "text=Areas del proyecto creadas",

  invalidTemplateToast: "text=Error",
};
