import mammoth from 'mammoth';

/**
 * Options for DOCX conversion
 */
interface DocxConversionOptions {
    styleMap?: string[];
}

/**
 * Result of DOCX to HTML conversion
 */
interface DocxConversionResult {
    value: string;
    messages: any[];
}

/**
 * Converts a DOCX ArrayBuffer to HTML content
 * @param arrayBuffer - The DOCX file content as ArrayBuffer
 * @param options - Optional conversion configurations
 * @returns Promise with converted HTML
 */
export async function convertDocxToHtml(
    arrayBuffer: ArrayBuffer,
    options: DocxConversionOptions = {}
): Promise<string> {
    try {
        // Mammoth default options work well for clean HTML
        // We can add custom style mappings if needed
        const defaultOptions = {
            styleMap: [
                "p[style-name='Title'] => h1:fresh",
                "p[style-name='Heading 1'] => h2:fresh",
                "p[style-name='Heading 2'] => h3:fresh",
                ... (options.styleMap || [])
            ]
        };

        const result: DocxConversionResult = await mammoth.convertToHtml({ arrayBuffer }, defaultOptions);

        // We could log warnings from result.messages if needed
        // console.log(result.messages);

        return result.value;
    } catch (error) {
        console.error('Error converting DOCX to HTML:', error);
        throw new Error('Failed to convert Word document to HTML');
    }
}
