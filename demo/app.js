import { parse, parseFile, inferSchemaFromSample } from '../dist/index.esm.js';

const csvInput = document.getElementById('csvInput');
const parseBtn = document.getElementById('parseBtn');
const inferSchemaBtn = document.getElementById('inferSchemaBtn');
const fileInput = document.getElementById('fileInput');
const output = document.getElementById('output');

parseBtn.addEventListener('click', async () => {
    const csv = csvInput.value;
    output.textContent = 'Parsing...';
    output.classList.add('loading');

    try {
        const result = await parse(csv);
        output.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    } finally {
        output.classList.remove('loading');
    }
});

inferSchemaBtn.addEventListener('click', async () => {
    const csv = csvInput.value;
    output.textContent = 'Inferring schema...';
    output.classList.add('loading');

    try {
        const schema = await inferSchemaFromSample(csv);
        output.textContent = JSON.stringify(schema, null, 2);
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    } finally {
        output.classList.remove('loading');
    }
});

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        output.textContent = 'Parsing file...';
        output.classList.add('loading');

        try {
            const result = await parseFile(file);
            output.textContent = JSON.stringify(result, null, 2);
        } catch (error) {
            output.textContent = `Error: ${error.message}`;
        } finally {
            output.classList.remove('loading');
        }
    }
});