// Test vet papers for Boo, with the answer each one should give.
// Every pet, owner, clinic and number here is made up: no real personal data.
// make-papers.mjs renders them to PDFs and phone-like photos in evals/boo/out/.
//
// `expected` lists only what a paper actually says. `null` means "not on the paper":
// Boo must leave it empty, never guess.

const page = (body, { font = 'Helvetica, Arial, sans-serif', size = 15 } = {}) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @page { size: letter; margin: 0 }
  * { box-sizing: border-box }
  body { margin: 0; width: 1275px; min-height: 1650px; padding: 90px 100px; background: #fff; color: #1d1d1f; font: ${size}px/1.45 ${font} }
  h1 { font-size: 30px; margin: 0 0 4px } h2 { font-size: 19px; margin: 28px 0 8px; border-bottom: 2px solid #222; padding-bottom: 4px }
  .muted { color: #555 } .row { display: flex; gap: 40px } .row > div { flex: 1 }
  table { width: 100%; border-collapse: collapse; margin-top: 8px } td, th { border: 1px solid #999; padding: 8px 10px; text-align: left; vertical-align: top }
  th { background: #eee } .right { text-align: right } .box { border: 2px solid #222; padding: 18px 22px; margin-top: 18px }
  .label { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: #555 } .val { font-size: 17px; font-weight: 600; min-height: 24px }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 30px } .sig { font-family: 'Snell Roundhand', 'Brush Script MT', cursive; font-size: 30px }
</style></head><body>${body}</body></html>`

const header = (clinic, address, phone) => `
  <div class="row" style="align-items:flex-end;border-bottom:3px solid #222;padding-bottom:14px">
    <div><h1>${clinic}</h1><div class="muted">${address}<br>${phone}</div></div>
  </div>`

const field = (label, value) => `<div><div class="label">${label}</div><div class="val">${value}</div></div>`

export const PAPERS = [
  {
    file: '01-rabies-certificate.pdf',
    note: 'Standard rabies certificate, 3-year vaccine, clean PDF',
    html: page(`
      <div style="text-align:center"><h1 style="font-size:28px">RABIES VACCINATION CERTIFICATE</h1><div class="muted">Compendium of Animal Rabies Prevention and Control — NASPHV Form 51</div></div>
      <div class="box"><div class="grid">
        ${field('Owner', 'Jordan Ellis')}${field('Address', '412 Birch Lane, Portland, OR 97214')}${field('Phone', '(503) 555-0148')}
      </div></div>
      <div class="box"><div class="grid">
        ${field('Animal name', 'Biscuit')}${field('Species', 'Dog')}${field('Breed', 'Golden Retriever')}
        ${field('Sex', 'Male (neutered)')}${field('Date of birth', '04/12/2021')}${field('Weight', '68 lb')}
        ${field('Color', 'Gold')}${field('Microchip', '985112003456789')}${field('Rabies tag #', '26-04417')}
      </div></div>
      <div class="box"><div class="grid">
        ${field('Vaccine', 'Rabies — 3 year')}${field('Product / manufacturer', 'Imrab 3, Boehringer Ingelheim')}${field('Serial / lot', 'B2611-04')}
        ${field('Date vaccinated', '03/14/2026')}${field('Next vaccination due', '03/14/2029')}${field('Route', 'SQ')}
      </div></div>
      <div class="box"><div class="grid">
        ${field('Veterinarian', 'Sarah Kim, DVM')}${field('License #', 'OR-11823')}${field('Clinic', 'Maple Grove Animal Hospital')}
      </div><div style="margin-top:18px"><span class="label">Signature</span> <span class="sig">Sarah Kim</span></div></div>`),
    expected: {
      kind: 'vaccine certificate', readable: 'clear',
      pets: [{
        name: 'Biscuit', species: 'dog', breed: 'Golden Retriever', birthDate: '2021-04-12', microchip: '985112003456789',
        vaccines: [{ name: 'Rabies', given: '2026-03-14', due: '2029-03-14' }],
        meds: [],
      }],
      clinic: 'Maple Grove Animal Hospital', visitDate: '2026-03-14', amount: null,
    },
  },
  {
    file: '02-cat-vaccine-record.jpg',
    note: 'Vaccine record table for a cat, phone photo at an angle',
    photo: { angle: -4, shadow: true },
    html: page(`
      ${header('Harbor View Veterinary Clinic', '88 Wharf Street, San Diego, CA 92101', '(619) 555-0172')}
      <h2>Vaccination Record</h2>
      <div class="grid">${field('Patient', 'Luna')}${field('Species / breed', 'Feline — Domestic Shorthair')}${field('DOB', 'June 2, 2023')}
      ${field('Sex', 'Female, spayed')}${field('Client', 'M. Alvarez')}${field('Printed', 'Sep 10, 2026')}</div>
      <table><tr><th>Vaccine</th><th>Date given</th><th>Next due</th><th>Given by</th></tr>
        <tr><td>FVRCP</td><td>09/10/2026</td><td>09/10/2027</td><td>Dr. P. Okafor</td></tr>
        <tr><td>Rabies (Purevax 1 yr)</td><td>09/10/2026</td><td>09/10/2027</td><td>Dr. P. Okafor</td></tr>
        <tr><td>FeLV</td><td>09/10/2026</td><td>09/10/2027</td><td>Dr. P. Okafor</td></tr>
      </table>
      <p class="muted" style="margin-top:30px">Please keep this record for boarding and grooming. Questions? Call us anytime.</p>`),
    expected: {
      kind: 'vaccine certificate', readable: 'clear',
      pets: [{
        name: 'Luna', species: 'cat', breed: 'Domestic Shorthair', birthDate: '2023-06-02', microchip: null,
        vaccines:   [
          { name: 'FVRCP', given: '2026-09-10', due: '2027-09-10' },
          { name: 'Rabies', given: '2026-09-10', due: '2027-09-10' },
          { name: 'FeLV', given: '2026-09-10', due: '2027-09-10' },
        ],
        meds: [],
      }],
      clinic: 'Harbor View Veterinary Clinic', visitDate: '2026-09-10', amount: null,
    },
  },
  {
    file: '03-invoice-dog.pdf',
    note: 'Itemized invoice with vaccines, a test and a monthly med',
    html: page(`
      ${header('Sunset Pet Clinic', '2200 Ocean Ave, Santa Monica, CA 90405', '(310) 555-0193')}
      <div class="row" style="margin-top:20px"><div><b>INVOICE #48213</b><br>Date: 10/22/2026</div><div><b>Client:</b> Priya Shah<br>Acct 10294</div><div><b>Patient:</b> Cooper<br>Canine · Beagle · 5 yr</div></div>
      <table style="margin-top:24px"><tr><th>Description</th><th>Qty</th><th class="right">Amount</th></tr>
        <tr><td>Wellness exam — Dr. Lena Brooks</td><td>1</td><td class="right">$68.00</td></tr>
        <tr><td>DHPP vaccine (1 yr)</td><td>1</td><td class="right">$32.00</td></tr>
        <tr><td>Bordetella vaccine, oral</td><td>1</td><td class="right">$28.00</td></tr>
        <tr><td>Heartworm / tick panel (4Dx)</td><td>1</td><td class="right">$45.00</td></tr>
        <tr><td>Simparica Trio 22.1–44 lb, 6 doses<br><span class="muted">Give 1 chewable by mouth once a month</span></td><td>1</td><td class="right">$162.00</td></tr>
        <tr><td colspan="2" class="right"><b>Total</b></td><td class="right"><b>$335.00</b></td></tr>
        <tr><td colspan="2" class="right">Paid — Visa ****4417</td><td class="right">$335.00</td></tr>
      </table>
      <h2>Reminders</h2>
      <table><tr><th>Service</th><th>Due</th></tr><tr><td>DHPP</td><td>10/22/2027</td></tr><tr><td>Bordetella</td><td>04/22/2027</td></tr><tr><td>4Dx test</td><td>10/22/2027</td></tr></table>`),
    expected: {
      kind: 'invoice', readable: 'clear',
      pets: [{
        name: 'Cooper', species: 'dog', breed: 'Beagle', birthDate: null, microchip: null,
        vaccines:   [
          { name: 'DHPP', given: '2026-10-22', due: '2027-10-22' },
          { name: 'Bordetella', given: '2026-10-22', due: '2027-04-22' },
        ],
        meds: [{ name: 'Simparica Trio', where: 'to give at home', perDay: null, days: null }],
      }],
      clinic: 'Sunset Pet Clinic', visitDate: '2026-10-22', amount: '335.00',
    },
  },
  {
    file: '04-visit-summary-cat.jpg',
    note: 'Discharge notes after a sick visit, short US dates, photo with a shadow',
    photo: { angle: 2.5, shadow: true, blur: 0.6 },
    html: page(`
      ${header('Northside Cat Clinic', '515 N Clark St, Chicago, IL 60654', '(312) 555-0110')}
      <h2>Visit Summary / Discharge Instructions</h2>
      <div class="grid">${field('Patient', 'Pepper')}${field('Species', 'Cat')}${field('Breed', 'Siamese mix')}${field('Visit date', '11/03/26')}${field('Doctor', 'Dr. Hannah Reyes')}${field('Weight', '9.2 lb')}</div>
      <h2>Reason for visit</h2><p>Vomiting x 2 days, decreased appetite.</p>
      <h2>Findings</h2><p>Mild dehydration. Abdomen soft, non-painful. No foreign body palpated.</p>
      <h2>Medications dispensed</h2>
      <table><tr><th>Medication</th><th>Instructions</th></tr>
        <tr><td>Cerenia (maropitant) 16 mg tablets</td><td>Give ½ tablet by mouth once daily for 4 days</td></tr>
        <tr><td>Hill's i/d canned food</td><td>Feed small meals 3–4 times a day for 5 days</td></tr></table>
      <h2>Follow-up</h2><p>Recheck if vomiting continues past 48 hours or if Pepper stops eating.</p>`),
    expected: {
      kind: 'visit summary', readable: 'clear',
      pets: [{
        name: 'Pepper', species: 'cat', breed: 'Siamese mix', birthDate: null, microchip: null,
        vaccines: [],
        meds: [{ name: 'Cerenia', where: 'to give at home', perDay: 1, days: 4 }],
      }],
      clinic: 'Northside Cat Clinic', visitDate: '2026-11-03', amount: null,
    },
  },
  {
    file: '05-prescription-label.jpg',
    note: 'Pharmacy label on a pill bottle, small and slightly blurry',
    photo: { angle: -7, shadow: true, blur: 1.1, scale: 0.55 },
    html: page(`
      <div style="width:820px;margin:120px auto;border:3px solid #222;padding:28px 34px;font-size:22px;line-height:1.4">
        <div style="font-weight:700;font-size:26px">RIVERBEND VETERINARY</div><div class="muted" style="font-size:18px">77 Mill Rd, Austin, TX 78704 · (512) 555-0136</div>
        <hr style="border:0;border-top:2px solid #222">
        <div>Rx# 220871 &nbsp;&nbsp; Date: 11/12/2026</div>
        <div><b>DUKE</b> (Canine) — Owner: T. Nguyen</div>
        <div style="font-size:26px;font-weight:700;margin-top:10px">APOQUEL (oclacitinib) 16 mg</div>
        <div>Give 1 tablet by mouth twice daily for 14 days, then once daily.</div>
        <div>Qty: 30 tablets &nbsp;&nbsp; Refills: 2</div>
        <div class="muted" style="font-size:18px">Dr. M. Castillo, DVM · For animal use only</div>
      </div>`),
    expected: {
      kind: 'prescription', readable: 'clear',
      pets: [{
        name: 'Duke', species: 'dog', breed: null, birthDate: null, microchip: null,
        vaccines: [],
        meds: [{ name: 'Apoquel', where: 'to give at home', perDay: 2, days: 14 }],
      }],
      clinic: 'Riverbend Veterinary', visitDate: '2026-11-12', amount: null,
    },
  },
  {
    file: '06-lab-results.pdf',
    note: 'Bloodwork report: no vaccines, no meds',
    html: page(`
      ${header('Maple Grove Animal Hospital', '1900 SE Hawthorne Blvd, Portland, OR 97214', '(503) 555-0161')}
      <h2>Laboratory Report — Chemistry Panel</h2>
      <div class="grid">${field('Patient', 'Daisy')}${field('Species', 'Canine')}${field('Breed', 'Labrador Retriever')}${field('Age', '9 years')}${field('Collected', 'Aug 30, 2026')}${field('Doctor', 'Sarah Kim, DVM')}</div>
      <table><tr><th>Test</th><th>Result</th><th>Reference range</th><th>Units</th></tr>
        <tr><td>ALT</td><td>88</td><td>10–125</td><td>U/L</td></tr><tr><td>ALP</td><td>212 H</td><td>23–212</td><td>U/L</td></tr>
        <tr><td>BUN</td><td>19</td><td>7–27</td><td>mg/dL</td></tr><tr><td>Creatinine</td><td>1.1</td><td>0.5–1.8</td><td>mg/dL</td></tr>
        <tr><td>Glucose</td><td>101</td><td>74–143</td><td>mg/dL</td></tr><tr><td>Total protein</td><td>6.9</td><td>5.2–8.2</td><td>g/dL</td></tr></table>
      <p class="muted" style="margin-top:24px">Results reviewed by the attending veterinarian. Interpretation should be discussed with your veterinarian.</p>`),
    expected: {
      kind: 'lab results', readable: 'clear',
      pets: [{
        name: 'Daisy', species: 'dog', breed: 'Labrador Retriever', birthDate: null, microchip: null,
        vaccines: [],
        meds: [],
      }],
      clinic: 'Maple Grove Animal Hospital', visitDate: '2026-08-30', amount: null,
    },
  },
  {
    file: '07-two-cats-invoice.jpg',
    note: 'One invoice for two cats: Boo must not merge them',
    photo: { angle: 1.5, shadow: false },
    html: page(`
      ${header('Harbor View Veterinary Clinic', '88 Wharf Street, San Diego, CA 92101', '(619) 555-0172')}
      <div class="row" style="margin-top:20px"><div><b>INVOICE #77102</b><br>07/15/2026</div><div><b>Client:</b> Sam Rivera</div></div>
      <table style="margin-top:24px"><tr><th>Patient</th><th>Description</th><th class="right">Amount</th></tr>
        <tr><td>Oreo</td><td>Annual exam</td><td class="right">$62.00</td></tr>
        <tr><td>Oreo</td><td>FVRCP vaccine — next due 07/15/2027</td><td class="right">$29.00</td></tr>
        <tr><td>Mochi</td><td>Annual exam</td><td class="right">$62.00</td></tr>
        <tr><td>Mochi</td><td>Rabies vaccine, 1 yr — next due 07/15/2027</td><td class="right">$31.00</td></tr>
        <tr><td colspan="2" class="right"><b>Total</b></td><td class="right"><b>$184.00</b></td></tr></table>`),
    expected: {
      kind: 'invoice', readable: 'clear',
      pets: [
        { name: 'Oreo', vaccines: [{ name: 'FVRCP', given: '2026-07-15', due: '2027-07-15' }] },
        { name: 'Mochi', vaccines: [{ name: 'Rabies', given: '2026-07-15', due: '2027-07-15' }] },
      ],
      clinic: 'Harbor View Veterinary Clinic', visitDate: '2026-07-15', amount: '184.00',
    },
  },
  {
    file: '08-parrot-exam.pdf',
    note: 'Exotic vet, a parrot weighed in grams',
    html: page(`
      ${header('Avian & Exotic Animal Care', '340 Glenwood Ave, Raleigh, NC 27603', '(919) 555-0187')}
      <h2>Avian Wellness Exam</h2>
      <div class="grid">${field('Patient', 'Kiwi')}${field('Species', 'African Grey Parrot')}${field('Hatch date', '2019 (estimated)')}${field('Exam date', 'October 5, 2026')}${field('Weight', '452 g')}${field('Doctor', 'Dr. Owen Patel')}</div>
      <h2>Exam notes</h2><p>Bright, alert, responsive. Feathers in good condition. Beak and nails trimmed. Diet: pellets 70%, fresh vegetables 30%.</p>
      <h2>Recommendations</h2><p>Annual wellness exam. Weigh weekly at home; call if weight drops more than 5%.</p>`),
    expected: {
      kind: 'visit summary', readable: 'clear',
      pets: [{
        name: 'Kiwi', species: 'parrot', breed: 'African Grey', birthDate: null, microchip: null,
        vaccines: [],
        meds: [],
      }],
      clinic: 'Avian & Exotic Animal Care', visitDate: '2026-10-05', amount: null,
    },
  },
  {
    file: '09-handwritten-card.jpg',
    note: 'Handwritten vaccine card; one due date has only month and year',
    photo: { angle: -3, shadow: true, blur: 0.4 },
    html: page(`
      <div style="width:900px;margin:80px auto;border:3px solid #444;border-radius:16px;padding:36px 44px;background:#fdf8ec">
        <div style="font:700 26px Georgia, serif">Paws &amp; Whiskers Vet — Vaccination Card</div>
        <div style="margin-top:24px;font:34px 'Bradley Hand', 'Marker Felt', 'Comic Sans MS', cursive;line-height:1.6">
          Name: Bella<br>Breed: Corgi&nbsp;&nbsp; Dog<br>
          DHPP — 5/2/26 — next 05/2027<br>
          Rabies (1yr) — 5/2/26 — next 5/2/27
        </div>
      </div>`),
    expected: {
      kind: 'vaccine certificate', readable: 'clear',
      pets: [{
        name: 'Bella', species: 'dog', breed: 'Corgi', birthDate: null, microchip: null,
        vaccines:   [
          { name: 'DHPP', given: '2026-05-02', due: null },
          { name: 'Rabies', given: '2026-05-02', due: '2027-05-02' },
        ],
        meds: [],
      }],
      clinic: 'Paws & Whiskers Vet', visitDate: null, amount: null,
    },
  },
  {
    file: '10-too-blurry.jpg',
    note: 'The invoice from 03, photographed out of focus',
    from: '03-invoice-dog.pdf',
    photo: { angle: 5, shadow: true, blur: 9 },
    expected: { readable: 'too blurry' },
  },
  {
    file: '11-grocery-receipt.jpg',
    note: 'Not a vet paper: a store receipt',
    photo: { angle: -2, shadow: true },
    html: page(`
      <div style="width:520px;margin:60px auto;font:22px/1.5 'Courier New', monospace;text-align:center">
        FRESH MARKET #112<br>1450 Pine St, Seattle WA<br>11/20/2026 5:42 PM<br>--------------------------------
        <div style="text-align:left">BANANAS 2.1 LB &nbsp;&nbsp;&nbsp;&nbsp; 1.26<br>OAT MILK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 4.49<br>DOG TREATS CHKN &nbsp;&nbsp;&nbsp;&nbsp; 8.99<br>PAPER TOWELS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 6.79</div>
        --------------------------------<br><div style="text-align:left">TOTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 21.53</div>THANK YOU
      </div>`),
    expected: { kind: 'not a vet paper' },
  },
  {
    file: '12-er-invoice.pdf',
    note: 'Emergency visit: shots and fluids given at the clinic, one medicine to give at home; quantity is not a dose',
    html: page(`
      ${header('Bay Area Pet ER', '3200 Crow Canyon Rd, San Ramon, CA 94583', '(925) 555-0119')}
      <div class="row" style="margin-top:20px"><div><b>INVOICE #ER-55730</b><br>08/09/2026</div><div><b>Client:</b> K. Larsen</div><div><b>Patient:</b> Mango<br>Canine · Labradoodle · 3 yr · 31.2 kg</div></div>
      <table style="margin-top:24px"><tr><th>Description</th><th>Qty</th><th class="right">Amount</th></tr>
        <tr><td>Emergency exam — Dr. Ana Ruiz</td><td>1</td><td class="right">$185.00</td></tr>
        <tr><td>Abdominal radiographs, 2 views</td><td>1</td><td class="right">$298.00</td></tr>
        <tr><td>Maropitant 10 mg/mL injection, SQ (in hospital)</td><td>3.1 mL</td><td class="right">$46.80</td></tr>
        <tr><td>Lactated Ringer's, SQ fluids (in hospital)</td><td>500 mL</td><td class="right">$52.60</td></tr>
        <tr><td>Metronidazole 250 mg tablets — dispensed</td><td>14</td><td class="right">$30.00</td></tr>
        <tr><td colspan="2" class="right"><b>Total</b></td><td class="right"><b>$612.40</b></td></tr></table>
      <h2>Discharge instructions</h2>
      <p><b>Metronidazole 250 mg:</b> Give 1 tablet by mouth every 12 hours for 7 days, with food.</p>
      <p>Bland diet for 3 days. Recheck with your regular vet if vomiting returns.</p>`),
    expected: {
      kind: 'invoice', readable: 'clear',
      pets: [{
        name: 'Mango', species: 'dog', breed: 'Labradoodle', birthDate: null, microchip: null,
        vaccines: [],
        meds: [
          { name: 'Maropitant', where: 'given at the clinic' },
          { name: 'Lactated Ringer', where: 'given at the clinic' },
          { name: 'Metronidazole', where: 'to give at home', perDay: 2, days: 7 },
        ],
      }],
      clinic: 'Bay Area Pet ER', visitDate: '2026-08-09', amount: '612.40',
    },
  },
]
