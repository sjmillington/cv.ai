import { PDFDocument, PDFFont, PDFPage, PageSizes, StandardFonts, TextAlignment, layoutMultilineText, rgb } from "pdf-lib";
import { RouterOutputs } from "~/utils/api";

const primaryColor = rgb(87/255, 13/255, 248/255)
const black = rgb(0.2, 0.2, 0.2)

const mainTitleSize = 16
const minorTitleSize = 12
const bodySize = 11

const margins = 50;

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

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

const drawMultilineSection = ({
    page, text, font, width, cursor, alignment
 }: MultilineSectionProps) => {
    const lineWidth = font.widthOfTextAtSize(text, bodySize);
    
    const sectionHeight = Math.ceil(lineWidth / (width - 2 * margins)) * 1.2 * font.heightAtSize(bodySize)

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

        cursor -= drawMultilineSection({
            text: result,
            page,
            width,
            alignment: TextAlignment.Center,
            cursor,
            font
        })

    }

    //Work Entries
    if(user?.workEntries.length > 0) {

        cursor -= 2 * mainTitleSize

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

                cursor -= drawMultilineSection({
                    text: result,
                    page,
                    width,
                    alignment: TextAlignment.Left,
                    cursor,
                    font
                })

            }

            cursor -= mainTitleSize

        }

        //Education
        if(user.education) {

            cursor -= 2 * mainTitleSize

            page.drawText('EDUCATION', {
                x: getCenteredTextX('EDUCATION', minorTitleSize, page, font),
                y: cursor,
                size: minorTitleSize,
                font: font,
                color: primaryColor,
            })

            cursor -= mainTitleSize

            const { institution, course, start, end, grade, result } = user.education

            const title = `${course} | ${institution} | ${grade} | ${formatDate(start ?? new Date())} - ${end ? formatDate(end) : 'Present'}`.toUpperCase()

            page.drawText(title, {
                x: getCenteredTextX(title, bodySize, page, font),
                y: cursor,
                size: bodySize,
                font: font,
                color: primaryColor,
            })

            cursor -= (bodySize/2)

            const results = result?.split('\n') ?? []

            for(let result of results ) {

                cursor -= drawMultilineSection({
                    text: result,
                    page,
                    width,
                    alignment: TextAlignment.Left,
                    cursor,
                    font
                })

            }

            cursor -= mainTitleSize

        }
    }

    return await pdfDoc.saveAsBase64({ dataUri: true })
}