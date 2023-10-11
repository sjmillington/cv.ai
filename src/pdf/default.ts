import { PDFDocument, type PDFFont, type PDFPage, PageSizes, type RGB, StandardFonts, TextAlignment, layoutMultilineText, rgb } from "pdf-lib";
import { type RouterOutputs } from "~/utils/api";
import { type Hex } from '../components/form/ColourPicker'


const black = rgb(0.2, 0.2, 0.2)

const mainTitleSize = 16
const minorTitleSize = 14
const bodySize = 12

const margins = 50;

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

const formatDate = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

const getCenteredTextX = (value: string, textSize: number, page: PDFPage, font: PDFFont) => {
    const textWidth = font.widthOfTextAtSize(value, textSize);

    return page.getWidth() / 2 - textWidth / 2
} 


interface MultilineSectionProps {
    page: PDFPage,
    text: string,
    font: PDFFont,
    fontSize: number,
    color: RGB,
    width: number,
    alignment: TextAlignment
    cursor: number
}

const drawMultilineSection = ({
    page, text, font, width, cursor, alignment, fontSize, color
 }: MultilineSectionProps) => {
    const lineWidth = font.widthOfTextAtSize(text, fontSize);
    
    const sectionHeight = Math.ceil(lineWidth / (width - 2 * margins)) * 1.2 * font.heightAtSize(fontSize)

    const { lines } = layoutMultilineText(text, {
        alignment,
        font,
        fontSize: fontSize,
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
            size: fontSize,
            font,
            color,
        })
    })

    return sectionHeight
}

function hexToRgb(hex: Hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return {
      r: parseInt(result?.[1] ?? '00', 16),
      g: parseInt(result?.[2] ?? '00', 16),
      b: parseInt(result?.[3] ?? '00', 16)
    }
  }

interface Options {
    colour: Hex
}

export default async function generate(user: RouterOutputs['user']['current'], options: Options) {

    const { colour } = options

    if(!user) {
        return;
    }
    
    const { r, g, b } = hexToRgb(colour)
    const primaryColor = rgb(r/255, g/255, b/255)

    const pdfDoc = await PDFDocument.create()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const name = user.name ?? 'user'
 
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
            font,
            fontSize: bodySize,
            color: black
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

        for(const entry of user.workEntries) {

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

            for(const result of results ) {

                cursor -= drawMultilineSection({
                    text: result,
                    page,
                    width,
                    alignment: TextAlignment.Left,
                    cursor,
                    font,
                    fontSize: bodySize,
                    color: black
                })

            }

            cursor -= (2*mainTitleSize)

        }

        //Education
        if(user.education) {

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

            for(const result of results ) {

                cursor -= drawMultilineSection({
                    text: result,
                    page,
                    width,
                    alignment: TextAlignment.Left,
                    cursor,
                    font,
                    fontSize: bodySize,
                    color: black
                })

            }

            cursor -= mainTitleSize

        }

        //Skills section
        if(user.skills) {

            cursor -= 2 * mainTitleSize

            page.drawText('SKILLS', {
                x: getCenteredTextX('SKILLS', minorTitleSize, page, font),
                y: cursor,
                size: minorTitleSize,
                font: font,
                color: primaryColor,
            })

            cursor -= (bodySize/2)

            const skillText = user.skills.join(' | ')

            cursor -= drawMultilineSection({
                text: skillText,
                page,
                width,
                alignment: TextAlignment.Center,
                cursor,
                font,
                fontSize: bodySize,
                color: primaryColor
            })


             
        }
    }

    return await pdfDoc.saveAsBase64({ dataUri: true })
}