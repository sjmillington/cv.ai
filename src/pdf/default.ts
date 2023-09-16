import { User } from "@prisma/client";
import { PDFDocument, PDFFont, PDFPage, PageSizes, StandardFonts, TextAlignment, layoutMultilineText, rgb } from "pdf-lib";
import { RouterOutputs } from "~/utils/api";

const primaryColor = rgb(87/255, 13/255, 248/255)
const black = rgb(0.1, 0.1, 0.1)

const fontSize = 16
const bodySize = 12

const margins = 30;

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

    let cursor = height - 2 * bodySize;

    page.drawText(contact, {
        x: getCenteredTextX(contact, bodySize, page, font),
        y: cursor,
        size: bodySize,
        font: font,
        color: black,
    })

    cursor -= 2 * fontSize;
  
    page.drawText(name.toUpperCase(), {
        x: getCenteredTextX(name.toUpperCase(), fontSize, page, font),
        y: cursor,
        size: fontSize,
        font: font,
        color: primaryColor,
    })

    cursor -= fontSize

    page.drawLine({
        start: { x: 30, y: cursor},
        end: { x: width - 30, y: cursor },
        thickness: 1,
        color: rgb(0.6, 0.6, 0.6),
        dashArray: [4,4]
      })


    if(user.personal?.result) {

        cursor -= fontSize

        const { result } = user.personal

        const lineWidth = font.widthOfTextAtSize(result, fontSize);
        const height = font.heightAtSize(fontSize);
        const lineHeight = height + height * 0.2;

        const personalSectionHeight = (lineWidth / width) * lineHeight

        const { lines } = layoutMultilineText(result, {
            alignment: TextAlignment.Center,
            font,
            fontSize: bodySize,
            bounds: {
                x: 30,
                y: cursor - personalSectionHeight,
                width: width - 60,
                height: personalSectionHeight
            }
        })

        lines?.forEach(line => {
            page.drawText(line.text, {
                x: line.x, 
                y: line.y,
                size: bodySize,
                font: font,
                color: black,
            })
        })

        cursor - personalSectionHeight;

    }

 

    console.log('saving')
    return await pdfDoc.saveAsBase64({ dataUri: true })

   // saveByteArray(`${name}-CV.pdf`, bytes)
}