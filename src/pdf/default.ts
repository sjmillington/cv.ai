import { User } from "@prisma/client";
import { write } from "fs";
import { PDFDocument, PDFFont, PDFPage, PageSizes, StandardFonts, TextAlignment, layoutMultilineText, rgb } from "pdf-lib";
import { RouterOutputs } from "~/utils/api";

const primaryColor = rgb(87/255, 13/255, 248/255)
const black = rgb(0.1, 0.1, 0.1)

const mainTitleSize = 16
const minorTitleSize = 11
const bodySize = 10

const margins = 30;

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

const formatDate = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

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


interface MultilineSectionProps {
    page: PDFPage,
    text: string,
    font: PDFFont,
    width: number,
    alignment: TextAlignment
    cursor: number
}

const writeMultilineSection = ({
    page, text, font, width, cursor, alignment
 }: MultilineSectionProps) => {
    const lineWidth = font.widthOfTextAtSize(text, bodySize);
    
    const sectionHeight = (lineWidth / width) * 2 * font.heightAtSize(bodySize)

    const { lines } = layoutMultilineText(text, {
        alignment,
        font,
        fontSize: bodySize,
        bounds: {
            x: margins,
            y: cursor - sectionHeight,
            width: width - (2 * margins),
            height: sectionHeight
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

    return sectionHeight
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

    const fontHeightAtBodySize = font.heightAtSize(bodySize);

    //contact section
    const contact = [user.phoneNumber, user.email, user.website].filter(c => c !== null && c !== undefined).join(' | ')

    let cursor = height - 2 * bodySize;

    page.drawText(contact, {
        x: getCenteredTextX(contact, bodySize - 2, page, font),
        y: cursor,
        size: bodySize - 2,
        font: font,
        color: black,
    })

    cursor -= 2 * mainTitleSize;
  
    //name
    page.drawText(name.toUpperCase(), {
        x: getCenteredTextX(name.toUpperCase(), mainTitleSize, page, font),
        y: cursor,
        size: mainTitleSize,
        font: font,
        color: primaryColor,
    })

    cursor -= mainTitleSize

    page.drawLine({
        start: { x: 30, y: cursor},
        end: { x: width - 30, y: cursor },
        thickness: 1,
        color: rgb(0.6, 0.6, 0.6),
        dashArray: [4,4]
      })

    // Personal section
    if(user.personal?.result) {

        cursor -= mainTitleSize

        const { result } = user.personal

        cursor -= writeMultilineSection({
            text: result,
            page,
            width,
            alignment: TextAlignment.Center,
            cursor,
            font
        })

    }

    if(user?.workEntries.length > 0) {

        cursor -= mainTitleSize

        page.drawText('EXPERIENCE', {
            x: getCenteredTextX('EXPERIENCE', minorTitleSize, page, font),
            y: cursor,
            size: minorTitleSize,
            font: font,
            color: primaryColor,
        })

        cursor -= mainTitleSize

        for(let entry of user.workEntries) {

            const title = `${entry.company} | ${entry.role} | ${formatDate(entry.start ?? new Date())} - ${entry.end ? formatDate(entry.end) : 'Present'}`.toUpperCase()

            page.drawText(title, {
                x: getCenteredTextX(title, bodySize, page, font),
                y: cursor,
                size: bodySize,
                font: font,
                color: primaryColor,
            })

            cursor -= (bodySize/2)

            const results = entry?.result?.split('\n') ?? []

            for(let result of results ) {

                const lineWidth = font.widthOfTextAtSize(result, bodySize);
    
                const sectionHeight = Math.ceil(lineWidth / (width - 2 * margins)) * fontHeightAtBodySize * 1.2

                console.log(sectionHeight)
    
                const { lines } = layoutMultilineText(result, {
                    alignment: TextAlignment.Left,
                    font,
                    fontSize: bodySize,
                    bounds: {
                        x: margins,
                        y: cursor - sectionHeight,
                        width: width - (2 * margins),
                        height: sectionHeight
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
    
                cursor -= sectionHeight

            }

            cursor -= mainTitleSize

           

        }
    }

 

    console.log('saving')
    return await pdfDoc.saveAsBase64({ dataUri: true })

   // saveByteArray(`${name}-CV.pdf`, bytes)
}