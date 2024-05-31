import path from "path";
import {fileURLToPath} from "url";
import {createMail} from "./Mail";
// import PDFDocument from "pdfkit";
import PDFDocument from "pdfkit-table";
import * as fs from "fs";
import qr from "qrcode";
import blobStream from "blob-stream";
import blobToBase64 from "blob-to-base64";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateQRCode = async (data) => {
    try {
        const qrImage = await qr.toDataURL(data);
        return qrImage;
    } catch (error) {
        console.error('حدث خطأ في إنشاء رمز الاستجابة السريعة:', error);
        throw error;
    }
};

export const createPDF = async () => {
    try {
        const pathName = path.join(__dirname,   `./../../uploads/example.pdf`);

        const doc = new PDFDocument({size: 'A4', margin: 30});
        // doc.pipe(fs.createWriteStream(pathName));
        const stream = doc.pipe(blobStream());

        const qrCode = await generateQRCode("test")
        doc.image(path.join(__dirname,   `./../../uploads/originalLogo.png`), 30, 50, {width: 100})
        doc.image(qrCode,455.28, 50, {width: 100})

        doc.fontSize(20).text('Invoice', 30, 180);

        doc.fontSize(12).fillColor('#000').text('Name:', 30, 250);
        doc.fontSize(11).fillColor('#555').text('emad', 70, 250);

        doc.fontSize(12).fillColor('#000').text('Address:', 30, 270);
        doc.fontSize(11).fillColor('#555').text('oued rhiou', 80, 270);

        doc.fontSize(12).fillColor('#000').text('Store name:', 30, 290);
        doc.fontSize(11).fillColor('#555').text('my store', 100, 290);

        doc.fontSize(12).fillColor('#000').text('Store Address:', 30, 310);
        doc.fontSize(11).fillColor('#555').text('algiers', 112, 310);

        doc.fontSize(12).fillColor('#000').text('Order Status:', 30, 330);
        doc.fontSize(11).fillColor('#555').text('completed', 105, 330);

        doc.fontSize(12).fillColor('#000').text('Date:', 30, 350);
        doc.fontSize(11).fillColor('#555').text('2023-12-02', 60, 350).fillColor('#000');

        doc.table({
            headers: [
                {label: "Product", align: "center", valign: "center", headerColor: "blue", headerOpacity: 0.15},
                {label: "Price", align: "center", valign: "center", headerColor: "blue", headerOpacity: 0.15},
                {label: "Quantity", align: "center", valign: "center", headerColor: "blue", headerOpacity: 0.15},
                {label: "Total", align: "center", valign: "center", headerColor: "blue", headerOpacity: 0.15},
            ],
            rows: [
                [ "Product 1", "10", "1", "10" ],
                [ "Product 2", "67", "5", "675" ],
                [ "Product 3", "33", "4", "334" ],
            ]
        }, {
            width: 535.28,
            y: 400,
            minRowHeight: 15,
            // @ts-ignore
            header: {disabled: false},
            horizontal: {disabled: false},
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                return doc.font("Helvetica").fontSize(10);
            },
        });


        // @ts-ignore
        doc.table({
            headers: [
                {label: "", align: "center", valign: "center"},
                {label: "", align: "center", valign: "center"}
            ],
            rows: [
                [ "Subtotal", "10$" ],
                [ "Coupons", "67$" ],
                [ "Tax", "33$" ],
                [ "Total", "33$" ]
            ]
        }, {
            columnsSize: [ 80, 100 ],
            x: 385.28,
            hideHeader: true,
            minRowHeight: 15,
            // @ts-ignore
            header: {disabled: false},
            horizontal: {disabled: false},
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(10);
                // @ts-ignore
                return indexColumn === 0 && doc?.addBackground(rectCell, 'blue', 0.15);
            },
        });

        // doc.pipe(stream);
        doc.end();

        // @ts-ignore
        stream.on('finish', async function () {
            // get a blob you can do whatever you like with
            const blob = stream.toBlob('application/pdf');
            console.log({blob});

            const blobBase64 = await blobToBase(blob)
            console.log({blobBase64});

            // or get a blob URL for display in the browser
            const url = stream.toBlobURL('application/pdf');
            console.log({url});
            
            // iframe.src = url;
        });

        return true
    } catch (error) {
        console.log(error)
    }
}

function blobToBase(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        blobToBase64(blob, function (error, base64) {
            if (error) {
                reject(error);
            } else {
                resolve(base64);
            }
        })
    });
}