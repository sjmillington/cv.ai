import { User } from "@prisma/client";
import { PDFDocument, PDFFont, PDFPage, PageSizes, StandardFonts, rgb } from "pdf-lib";
import { RouterOutputs } from "~/utils/api";

const primaryColor = rgb(87/255, 13/255, 248/255)
const black = rgb(0.1, 0.1, 0.1)

const fontSize = 16
const bodySize = 12

const saveByteArray = (reportName: string, byte: Uint8Array) => {
    var blob = new Blob([byte], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};

const getCenteredTextX = (value: string, textSize: number, page: PDFPage, font: PDFFont) => {
    const textWidth = font.widthOfTextAtSize(value, textSize);

    return page.getWidth() / 2 - textWidth / 2
} 

export default async function generate(user: RouterOutputs['user']['current']) {

    if(!user) {
        return;
    }

    const pdfDoc = await PDFDocument.create()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)


    const name = user.name || 'user'
 
    const page = pdfDoc.addPage(PageSizes.A4)

    const { width, height } = page.getSize()

    const contact = [user.phoneNumber, user.email, user.website].filter(c => c !== null && c !== undefined).join(' | ')

    let lineHeight = height - 2 * bodySize;

    page.drawText(contact, {
        x: getCenteredTextX(contact, bodySize, page, font),
        y: lineHeight,
        size: bodySize,
        font: font,
        color: black,
    })

    lineHeight -= 2 * fontSize;
  
    page.drawText(name.toUpperCase(), {
        x: getCenteredTextX(name.toUpperCase(), fontSize, page, font),
        y: lineHeight,
        size: fontSize,
        font: font,
        color: primaryColor,
    })

    lineHeight -= fontSize

    page.drawLine({
        start: { x: 40, y: lineHeight},
        end: { x: width - 40, y: lineHeight },
        thickness: 1,
        color: rgb(0.6, 0.6, 0.6),
        dashArray: [4,4]
      })

 

    if(user.personal?.result) {

        lineHeight -= fontSize

        //todo!
        page.drawText(user.personal?.result, {
            x: getCenteredTextX(user.personal?.result, bodySize, page, font),
            y: lineHeight,
            maxWidth: 200,
            size: bodySize,
            font: font,
            color: black,
        })

    }

 

    console.log('saving')
    const bytes = await pdfDoc.save()

    saveByteArray(`${name}-CV.pdf`, bytes)
}