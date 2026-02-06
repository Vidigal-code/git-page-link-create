export function getOfficeViewerUrl(sourceUrl: string): string {
    const encoded = encodeURIComponent(sourceUrl);
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`;
}
