/* jslint node: true */
'use strict';

function tablify(options) {

    options = options || {};

    const idAttribute = options.table_id ? ` id="${options.table_id}" ` : '';
    const classAttribute = options.table_class ? ` class="${options.table_class}"` : '';
    const header_mapping = options.header_mapping || {};
    const pretty = (options.pretty == undefined) ? true : options.pretty;

    let tableData = options.data || [];
    let isSingleRow = false;
    let header = options.header;

    if (!Array.isArray(tableData)) {
        isSingleRow = true;
        tableData = [tableData];
    }

    // If header exists in options use that else create it.
    if (!Array.isArray(header)) {
        let headerObj = {};
        tableData.forEach(function (json) {
            Object.keys(json).forEach(function (key) {
                headerObj[key] = true;
            });
        });
        header = Object.keys(headerObj);
    }

    if (isSingleRow && tableData.length === 1) {
        // Don't create row if value is not defined for the header (key for objects)
        header = header.filter(function (h) {
            return tableData[0][h];
        });
    }

    // Generate table
    let htmlTable = '';
    let cellArray = [];
    let cellRow = [];

    cellArray.push(cellRow);

    header.forEach(function (key) {
        cellRow.push('<th>' + (header_mapping[key] || key) + '</th>');
    });

    tableData.forEach(function (json) {
        cellRow = [];
        cellArray.push(cellRow);
        header.forEach(function (key) {
            let value = json[key];
            if (value === undefined) {
                value = '';
            } else if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }
            cellRow.push('<td>' + value + '</td>');
        });
    });

    if (isSingleRow && cellArray.length) {
        // Transpose the array to show object as key-value pair instead of table
        cellArray = cellArray[0].map(function(col, i) {
            return cellArray.map(function(row) {
                return row[i];
            })
        });
    }

    if (tableData.length) {

        htmlTable += `<table${idAttribute}${classAttribute}>`;

        htmlTable += '<thead>';
        htmlTable += '<tr>';
        cellArray[0].forEach(th => {
            htmlTable += th;
        });
        cellArray.shift();
        htmlTable += '</tr>';
        htmlTable += '</thead>';

        htmlTable += '<tbody>';
        cellArray.forEach(row => {
            htmlTable += '<tr>';
            row.forEach(cell => {
                htmlTable += cell;
            });
            htmlTable += '</tr>';
        });
        htmlTable += '</tbody>';

        htmlTable += '</table>';

    }

    return htmlTable;
}

const html_tablify = {
    tablify: tablify
};

module.exports = html_tablify;
