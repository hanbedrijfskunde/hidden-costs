// --- DOM Elements ---
const tabs = {
  manual: {
    button: document.getElementById("tab-manual"),
    content: document.getElementById("content-manual"),
  },
  environmental: {
    button: document.getElementById("tab-environmental"),
    content: document.getElementById("content-environmental"),
  },
  social: {
    button: document.getElementById("tab-social"),
    content: document.getElementById("content-social"),
  },
  governance: {
    button: document.getElementById("tab-governance"),
    content: document.getElementById("content-governance"),
  },
};

const inputs = {
  companyName: document.getElementById("companyName"),
  emissions: document.getElementById("emissions"),
  scc: document.getElementById("scc"),
  climateCostResult: document.getElementById("climateCostResult"),
  // Textareas
  "claim-climate": document.getElementById("claim-climate"),
  "controverse-climate": document.getElementById("controverse-climate"),
  "claim-plastic": document.getElementById("claim-plastic"),
  "controverse-plastic": document.getElementById("controverse-plastic"),
  "claim-deforestation": document.getElementById("claim-deforestation"),
  "controverse-deforestation": document.getElementById(
    "controverse-deforestation"
  ),
  "claim-humanrights": document.getElementById("claim-humanrights"),
  "controverse-humanrights": document.getElementById(
    "controverse-humanrights"
  ),
  "claim-labor": document.getElementById("claim-labor"),
  "controverse-labor": document.getElementById("controverse-labor"),
  "claim-governance": document.getElementById("claim-governance"),
  "controverse-governance": document.getElementById(
    "controverse-governance"
  ),
  "claim-transparency": document.getElementById("claim-transparency"),
  "controverse-transparency": document.getElementById(
    "controverse-transparency"
  ),
};

const storageKey = "companyAnalysisData";

// --- Example Data ---
const aholdExampleData = {
  companyName: "Ahold Delhaize",
  emissions: "66.1",
  scc: "190",
  "claim-climate":
    "Ahold Delhaize profileert zich als een klimaatleider met ambitieuze, door het SBTi gevalideerde doelstellingen: een reductie van 50% van de eigen emissies (Scope 1 en 2) in 2030, en een Net-Zero doelstelling voor de gehele waardeketen in 2050.",
  "controverse-climate":
    "Ondanks de doelen, zijn de emissies in de meest materiële categorie – Scope 3 FLAG (Forest, Land and Agriculture) – sinds 2020 met 9,9% gestegen. Het bedrijf rapporteert niet apart over methaanuitstoot en heeft er geen specifieke reductiedoelen voor, terwijl dit 44% van de FLAG-emissies vertegenwoordigt. De 'Say-Do Gap' is dat de claim van leiderschap wordt ondermijnd door stijgende emissies in de meest impactvolle categorie.",
  "claim-plastic":
    "Ahold Delhaize heeft doelen om het gebruik van nieuw (virgin) plastic te verminderen en de recyclebaarheid te verhogen.",
  "controverse-plastic":
    "Klacht bij AFM (ClientEarth/Plastic Soup Foundation) wegens misleiden van investeerders. Het bedrijf is niet transparant over zijn totale plastic voetafdruk en rapporteert de daaraan verbonden financiële risico's niet. 82% van Albert Heijn huismerkproducten is in plastic verpakt. Dit is een governance-falen.",
  "claim-deforestation":
    "Streeft naar 100% ontbossingsvrije toeleveringsketens voor huismerkproducten in 2025 via certificering voor risicogrondstoffen zoals palmolie en soja.",
  "controverse-deforestation":
    "Eerdere deadlines (2020) zijn niet gehaald. Het bedrijf vertrouwt op bekritiseerde certificeringsschema's (zoals RTRS voor soja) die door experts als ineffectief en een vorm van 'greenwashing' worden gezien. De methode is onvoldoende om de claim te garanderen.",
  "claim-humanrights":
    "Het bedrijf stelt de mensenrechten serieus te nemen en due diligence uit te voeren via audits en 'Standards of Engagement'. Na een klacht is een Human Rights Impact Assessment (HRIA) aangekondigd.",
  "controverse-humanrights":
    "Formele OESO-klacht (Migrant Justice) documenteert 'ernstige en systemische mensenrechtenschendingen' bij Amerikaanse zuivelleveranciers: excessieve werkweken, lonen onder het minimum, onveilige huisvesting, en indicatoren van dwangarbeid. Het officiële klachtenmechanisme is ontoegankelijk en ineffectief. De due diligence heeft gefaald.",
  "claim-labor":
    "Het bedrijf claimt een goede werkgever te zijn met aandacht voor eerlijke lonen, veiligheid en diversiteit voor het eigen personeel.",
  "controverse-labor":
    "Analyseer hier de praktijk: wordt een leefbaar loon betaald aan alle werknemers? Wat is de onverklaarde genderloonkloof? Wat is het aantal en de frequentie van arbeidsongevallen? Wat zeggen vakbonden en werknemers over de werkomstandigheden?",
  "claim-governance":
    "Het bedrijf claimt robuuste processen voor ESG-risicomanagement te hebben en koppelt de beloning van de top aan duurzaamheidsdoelen.",
  "controverse-governance":
    "De diverse controverses (klimaat, plastic, mensenrechten) wijzen op een fundamenteel falen in het risicomanagement. Het bedrijf vertrouwt op ineffectieve mechanismen (audits, zwakke certificering). De koppeling van beloning aan ESG-doelen is vaak onduidelijk en niet gekoppeld aan absolute, wetenschappelijke doelen.",
  "claim-transparency":
    "Het bedrijf streeft naar transparante rapportage over zijn duurzaamheidsprestaties en lobby-activiteiten.",
  "controverse-transparency":
    "Het niet-rapporteren van de plastic voetafdruk is een voorbeeld van een gebrek aan transparantie. Onderzoek of de lobby-activiteiten in strijd zijn met de publieke duurzaamheidsdoelen. Is de ESG-data onafhankelijk ge-audit met 'reasonable assurance'?",
};

// --- Functions ---

/**
 * Switches the active tab.
 * @param {string} tabName - The name of the tab to show.
 */
function showTab(tabName) {
  for (const key in tabs) {
    const isSelectedTab = key === tabName;
    tabs[key].button.classList.toggle("tab-active", isSelectedTab);
    tabs[key].button.classList.toggle("tab-inactive", !isSelectedTab);
    tabs[key].content.classList.toggle("hidden", !isSelectedTab);
  }
}

/**
 * Calculates the hidden climate cost and updates the display.
 */
function calculateClimateCost() {
  const emissionsMt = parseFloat(inputs.emissions.value) || 0;
  const sccPerTon = parseFloat(inputs.scc.value) || 0;

  const totalCost = emissionsMt * 1000000 * sccPerTon;

  let displayValue;
  if (totalCost >= 1e9) {
    displayValue = `$${(totalCost / 1e9).toFixed(1)} Miljard`;
  } else if (totalCost >= 1e6) {
    displayValue = `$${(totalCost / 1e6).toFixed(1)} Miljoen`;
  } else {
    displayValue = `$${totalCost.toLocaleString("nl-NL")}`;
  }

  inputs.climateCostResult.textContent = displayValue;
}

/**
 * Saves all input data to localStorage.
 */
function saveData() {
  const data = {};
  for (const key in inputs) {
    if (key !== "climateCostResult") {
      data[key] = inputs[key].value;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(data));
}

/**
 * Loads data from localStorage and populates the form.
 */
function loadData() {
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    const data = JSON.parse(savedData);
    for (const key in data) {
      if (inputs[key]) {
        inputs[key].value = data[key];
      }
    }
    calculateClimateCost(); // Recalculate on load
  }
}

/**
 * Resets all data in the form and localStorage.
 */
function resetData() {
  if (
    confirm(
      "Weet je zeker dat je alle ingevoerde data wilt wissen? Deze actie kan niet ongedaan worden gemaakt."
    )
  ) {
    localStorage.removeItem(storageKey);
    // Reset all input fields
    for (const key in inputs) {
      if (
        inputs[key].tagName === "TEXTAREA" ||
        inputs[key].tagName === "INPUT"
      ) {
        if (key !== "scc") {
          // Don't reset the SCC value
          inputs[key].value = "";
        }
      }
    }
    // Manually reset SCC if it was cleared
    inputs.scc.value = "190";
    calculateClimateCost();
    alert("Analyse is gereset.");
  }
}

/**
 * Exports current form data to a CSV file.
 */
function exportToCSV() {
  const data = {};
  const companyName = inputs.companyName.value || "Unknown_Company";
  
  // Collect all form data
  for (const key in inputs) {
    if (key !== "climateCostResult") {
      data[key] = inputs[key].value;
    }
  }

  // Create CSV content
  let csvContent = "Field,Value\n";
  for (const [key, value] of Object.entries(data)) {
    // Escape quotes and wrap in quotes if value contains commas or quotes
    const escapedValue = value.replace(/"/g, '""');
    const formattedValue = value.includes(',') || value.includes('"') || value.includes('\n') 
      ? `"${escapedValue}"` 
      : escapedValue;
    csvContent += `${key},${formattedValue}\n`;
  }

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${companyName.replace(/[^a-z0-9]/gi, '_')}_ESG_Analysis.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers the hidden file input for CSV import.
 */
function triggerImportCSV() {
  document.getElementById('csvFileInput').click();
}

/**
 * Imports data from a CSV file and populates the form.
 * @param {Event} event - The file input change event.
 */
function importFromCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.name.toLowerCase().endsWith('.csv')) {
    alert("Selecteer een geldig CSV bestand.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const csv = e.target.result;
      const lines = csv.split('\n');
      
      // Skip header row and process data
      const importedData = {};
      let validFields = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV parsing (handles quoted values)
        const match = line.match(/^([^,]+),(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          
          // Remove quotes if wrapped
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"');
          }
          
          if (inputs[key]) {
            importedData[key] = value;
            validFields++;
          }
        }
      }
      
      if (validFields === 0) {
        alert("Geen geldige data gevonden in het CSV bestand. Controleer het formaat.");
        return;
      }
      
      // Confirm import
      if (confirm(`${validFields} velden gevonden. Huidige data overschrijven met geïmporteerde data?`)) {
        // Clear existing data first
        for (const key in inputs) {
          if (key !== "climateCostResult" && key !== "scc") {
            inputs[key].value = "";
          }
        }
        
        // Load imported data
        for (const [key, value] of Object.entries(importedData)) {
          if (inputs[key]) {
            inputs[key].value = value;
          }
        }
        
        // Recalculate and save
        calculateClimateCost();
        saveData();
        alert("CSV data succesvol geïmporteerd!");
        
        // Switch to environmental tab if company data was imported
        if (importedData.companyName) {
          showTab("environmental");
        }
      }
      
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert("Fout bij het inlezen van het CSV bestand. Controleer het bestandsformaat.");
    }
  };
  
  reader.onerror = function() {
    alert("Fout bij het lezen van het bestand.");
  };
  
  reader.readAsText(file);
  
  // Reset file input for next use
  event.target.value = '';
}

/**
 * Loads the Ahold Delhaize example data into the form.
 */
function loadExampleData() {
  if (
    confirm(
      "Dit zal alle huidige data overschrijven met het Ahold Delhaize voorbeeld. Weet je het zeker?"
    )
  ) {
    for (const key in aholdExampleData) {
      if (inputs[key]) {
        inputs[key].value = aholdExampleData[key];
      }
    }
    calculateClimateCost();
    saveData(); // Save the example data so it persists
    alert("Voorbeelddata voor Ahold Delhaize is geladen.");
    showTab("environmental"); // Switch to a relevant tab
  }
}

// --- Event Listeners ---

// Load data when the page is ready
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  showTab("manual"); // Start on the manual tab
});

// Add event listeners to all input fields to save data on change
for (const key in inputs) {
  if (key !== "climateCostResult") {
    inputs[key].addEventListener("keyup", saveData);
    inputs[key].addEventListener("change", saveData); // For number inputs
  }
}

// Add specific listeners for the calculator
inputs.emissions.addEventListener("keyup", calculateClimateCost);
inputs.emissions.addEventListener("change", calculateClimateCost);
inputs.scc.addEventListener("keyup", calculateClimateCost);
inputs.scc.addEventListener("change", calculateClimateCost);