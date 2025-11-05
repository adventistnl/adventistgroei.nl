export const fundingPolicyGroupTranslations = {
  en: {
    // Modal titles and descriptions
    createGroup: "Create Funding Policy Group",
    createDescription: "Create a new funding policy group with custom validation fields",
    editGroup: "Edit Funding Policy Group",
    editDescription: "Update funding policy group and validation fields",
    deleteGroup: "Delete Funding Policy Group",
    deleteDescription: "Permanently remove this funding policy group",
    
    // Steps
    stepProgress: "Step {{current}} of {{total}}",
    groupInformation: "Group Information",
    groupInformationDesc: "Define the funding policy group details",
    validationFields: "Validation Fields",
    validationFieldsDesc: "Define required fields for this funding policy group",
    reviewConfirm: "Review & Confirm",
    reviewConfirmDesc: "Please review the information before creating",
    
    // Form fields - Group
    groupName: "Group Name",
    groupNamePlaceholder: "e.g., Church Plans, Department Projects",
    description: "Description",
    descriptionPlaceholder: "Describe the purpose of this funding policy group",
    activeStatus: "Active Status",
    activeStatusDesc: "Enable this group for use",
    
    // Validation Fields
    configuredFields: "Configured Fields ({{count}})",
    addValidationField: "Add Validation Field",
    noFieldsConfigured: "No validation fields configured yet",
    noFieldsConfiguredDesc: "Add fields that will be required when using this group",
    
    // Field Form
    fieldLabel: "Field Label",
    fieldLabelAuto: "Auto",
    fieldLabelPlaceholder: "e.g., Justification",
    fieldName: "Field Name",
    fieldNamePlaceholder: "e.g., justification",
    fieldType: "Field Type",
    fieldTypePlaceholder: "Select field type",
    searchFieldType: "Search field types...",
    noFieldTypeFound: "No field type found.",
    requiredField: "Required Field",
    options: "Options",
    optionPlaceholder: "Add option",
    addOption: "Add Option",
    addField: "Add Field",
    
    // Field Types
    fieldTypes: {
      TEXT: {
        label: "Text Input",
        description: "Single line text field",
        info: "A simple text input for short responses like names, titles, or brief notes. Limited to one line."
      },
      TEXTAREA: {
        label: "Text Area",
        description: "Multi-line text field",
        info: "A larger text area for longer responses like descriptions, justifications, or detailed explanations. Supports multiple lines."
      },
      NUMBER: {
        label: "Number",
        description: "Numeric input",
        info: "A numeric input field that only accepts numbers. Useful for quantities, amounts, or other numerical data."
      },
      DATE: {
        label: "Date",
        description: "Date picker",
        info: "A date picker that allows users to select a specific date. Useful for deadlines, start dates, or event dates."
      },
      SELECT: {
        label: "Dropdown",
        description: "Select from options",
        info: "A dropdown menu with predefined options. Users can only select one option from the list you define."
      },
      BOOLEAN: {
        label: "Yes/No",
        description: "Boolean switch",
        info: "A simple yes/no toggle switch. Useful for binary choices or confirmation fields."
      },
      FILE: {
        label: "File Upload",
        description: "File attachment",
        info: "A file upload field that allows users to attach documents, images, or other files. Supports common file formats."
      }
    },
    
    // Auto-generated labels
    validationFieldLabel: "{{fieldName}} ({{fieldType}} validation field)",
    
    // Badges and status
    required: "Required",
    active: "Active",
    inactive: "Inactive",
    new: "New",
    
    // Review section
    groupInfo: "Group Information",
    name: "Name",
    status: "Status",
    validationFieldsCount: "Validation Fields ({{count}})",
    
    // Buttons
    back: "Back",
    continue: "Continue",
    cancel: "Cancel",
    skipForNow: "Skip for now",
    createGroupButton: "Create Group",
    saveChanges: "Save Changes",
    creating: "Creating...",
    saving: "Saving...",
    delete: "Delete",
    deleting: "Deleting...",
    
    // Toast messages
    fieldAdded: "Validation field added!",
    fieldRemoved: "Validation field removed",
    groupCreated: "Funding policy group created successfully!",
    groupUpdated: "Funding policy group updated successfully!",
    groupDeleted: "Funding policy group deleted successfully!",
    
    // Validation messages
    validation: {
      nameRequired: "Group name is required",
      nameMinLength: "Group name must be at least 2 characters",
      descriptionRequired: "Description is required",
      descriptionMinLength: "Description must be at least 10 characters",
      fieldNameRequired: "Field name is required",
      fieldLabelRequired: "Field label is required",
      selectOptionsRequired: "Please add at least one option for dropdown field",
      fixErrors: "Please fix validation errors"
    },
    
    // Delete modal
    deleteWarning: "Are you sure you want to delete this group?",
    deleteConsequences: "Understand the consequences",
    deleteConsequencesDesc: "This action will:",
    deleteValidationFields: "Delete all {{count}} validation fields",
    deleteDataLoss: "Permanently remove all associated data",
    deleteActiveUsage: "Affect {{count}} items currently using this group",
    deletePermanent: "This action cannot be undone",
    deleteConfirmText: "Type 'delete group' to confirm",
    deleteConfirmPlaceholder: "delete group",
    usageWarning: "This group is currently being used by {{count}} items",
    usageWarningDesc: "Deleting it may affect existing data"
  },
  nl: {
    // Modal titles and descriptions
    createGroup: "Financieringsbeleidgroep Aanmaken",
    createDescription: "Maak een nieuwe financieringsbeleidgroep met aangepaste validatievelden",
    editGroup: "Financieringsbeleidgroep Bewerken",
    editDescription: "Werk de financieringsbeleidgroep en validatievelden bij",
    deleteGroup: "Financieringsbeleidgroep Verwijderen",
    deleteDescription: "Verwijder deze financieringsbeleidgroep permanent",
    
    // Steps
    stepProgress: "Stap {{current}} van {{total}}",
    groupInformation: "Groepsinformatie",
    groupInformationDesc: "Definieer de details van de financieringsbeleidgroep",
    validationFields: "Validatievelden",
    validationFieldsDesc: "Definieer verplichte velden voor deze financieringsbeleidgroep",
    reviewConfirm: "Controleren & Bevestigen",
    reviewConfirmDesc: "Controleer de informatie voordat u aanmaakt",
    
    // Form fields - Group
    groupName: "Groepsnaam",
    groupNamePlaceholder: "bijv. Kerkplannen, Afdelingsprojecten",
    description: "Beschrijving",
    descriptionPlaceholder: "Beschrijf het doel van deze financieringsbeleidgroep",
    activeStatus: "Actieve Status",
    activeStatusDesc: "Schakel deze groep in voor gebruik",
    
    // Validation Fields
    configuredFields: "Geconfigureerde Velden ({{count}})",
    addValidationField: "Validatieveld Toevoegen",
    noFieldsConfigured: "Nog geen validatievelden geconfigureerd",
    noFieldsConfiguredDesc: "Voeg velden toe die vereist zijn bij het gebruik van deze groep",
    
    // Field Form
    fieldLabel: "Veldlabel",
    fieldLabelAuto: "Auto",
    fieldLabelPlaceholder: "bijv. Rechtvaardiging",
    fieldName: "Veldnaam",
    fieldNamePlaceholder: "bijv. rechtvaardiging",
    fieldType: "Veldtype",
    fieldTypePlaceholder: "Selecteer veldtype",
    searchFieldType: "Zoek veldtypes...",
    noFieldTypeFound: "Geen veldtype gevonden.",
    requiredField: "Verplicht Veld",
    options: "Opties",
    optionPlaceholder: "Optie toevoegen",
    addOption: "Optie Toevoegen",
    addField: "Veld Toevoegen",
    
    // Field Types
    fieldTypes: {
      TEXT: {
        label: "Tekstinvoer",
        description: "Enkele regel tekstveld",
        info: "Een eenvoudige tekstinvoer voor korte antwoorden zoals namen, titels of korte notities. Beperkt tot één regel."
      },
      TEXTAREA: {
        label: "Tekstgebied",
        description: "Meerdere regels tekstveld",
        info: "Een groter tekstgebied voor langere antwoorden zoals beschrijvingen, rechtvaardigingen of gedetailleerde uitleg. Ondersteunt meerdere regels."
      },
      NUMBER: {
        label: "Nummer",
        description: "Numerieke invoer",
        info: "Een numeriek invoerveld dat alleen nummers accepteert. Handig voor hoeveelheden, bedragen of andere numerieke gegevens."
      },
      DATE: {
        label: "Datum",
        description: "Datumkiezer",
        info: "Een datumkiezer waarmee gebruikers een specifieke datum kunnen selecteren. Handig voor deadlines, startdata of evenementdata."
      },
      SELECT: {
        label: "Dropdown",
        description: "Selecteer uit opties",
        info: "Een dropdown menu met vooraf gedefinieerde opties. Gebruikers kunnen slechts één optie selecteren uit de lijst die u definieert."
      },
      BOOLEAN: {
        label: "Ja/Nee",
        description: "Booleaanse schakelaar",
        info: "Een eenvoudige ja/nee schakelaar. Handig voor binaire keuzes of bevestigingsvelden."
      },
      FILE: {
        label: "Bestand Uploaden",
        description: "Bestandsbijlage",
        info: "Een bestandsupload veld waarmee gebruikers documenten, afbeeldingen of andere bestanden kunnen toevoegen. Ondersteunt veelvoorkomende bestandsformaten."
      }
    },
    
    // Auto-generated labels
    validationFieldLabel: "{{fieldName}} ({{fieldType}} validatieveld)",
    
    // Badges and status
    required: "Verplicht",
    active: "Actief",
    inactive: "Inactief",
    new: "Nieuw",
    
    // Review section
    groupInfo: "Groepsinformatie",
    name: "Naam",
    status: "Status",
    validationFieldsCount: "Validatievelden ({{count}})",
    
    // Buttons
    back: "Terug",
    continue: "Doorgaan",
    cancel: "Annuleren",
    skipForNow: "Nu overslaan",
    createGroupButton: "Groep Aanmaken",
    saveChanges: "Wijzigingen Opslaan",
    creating: "Aanmaken...",
    saving: "Opslaan...",
    delete: "Verwijderen",
    deleting: "Verwijderen...",
    
    // Toast messages
    fieldAdded: "Validatieveld toegevoegd!",
    fieldRemoved: "Validatieveld verwijderd",
    groupCreated: "Financieringsbeleidgroep succesvol aangemaakt!",
    groupUpdated: "Financieringsbeleidgroep succesvol bijgewerkt!",
    groupDeleted: "Financieringsbeleidgroep succesvol verwijderd!",
    
    // Validation messages
    validation: {
      nameRequired: "Groepsnaam is verplicht",
      nameMinLength: "Groepsnaam moet minimaal 2 tekens bevatten",
      descriptionRequired: "Beschrijving is verplicht",
      descriptionMinLength: "Beschrijving moet minimaal 10 tekens bevatten",
      fieldNameRequired: "Veldnaam is verplicht",
      fieldLabelRequired: "Veldlabel is verplicht",
      selectOptionsRequired: "Voeg minimaal één optie toe voor dropdown veld",
      fixErrors: "Corrigeer validatiefouten"
    },
    
    // Delete modal
    deleteWarning: "Weet u zeker dat u deze groep wilt verwijderen?",
    deleteConsequences: "Begrijp de consequenties",
    deleteConsequencesDesc: "Deze actie zal:",
    deleteValidationFields: "Alle {{count}} validatievelden verwijderen",
    deleteDataLoss: "Alle gekoppelde gegevens permanent verwijderen",
    deleteActiveUsage: "{{count}} items die deze groep momenteel gebruiken beïnvloeden",
    deletePermanent: "Deze actie kan niet ongedaan worden gemaakt",
    deleteConfirmText: "Typ 'delete group' om te bevestigen",
    deleteConfirmPlaceholder: "delete group",
    usageWarning: "Deze groep wordt momenteel gebruikt door {{count}} items",
    usageWarningDesc: "Het verwijderen kan bestaande gegevens beïnvloeden"
  }
}
