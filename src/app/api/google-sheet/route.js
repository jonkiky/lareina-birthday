import { google } from "googleapis";

export async function GET() {
    try {
        const sheetId = process.env.GOOGLE_SHEETS_ID;
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

        const auth = new google.auth.JWT(clientEmail, null, privateKey, [
            "https://www.googleapis.com/auth/spreadsheets",
        ]);

        const sheets = google.sheets({ version: "v4", auth });

        const range = "Sheet1!A1:F24"; // Adjust the range as needed
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: range,
        });

        return new Response(JSON.stringify({ data: response.data.values }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(req) {
    try {
        const { name, email, kids, greeting, status } = await req.json();
        const sheetId = process.env.GOOGLE_SHEETS_ID;
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

        const auth = new google.auth.JWT(clientEmail, null, privateKey, [
            "https://www.googleapis.com/auth/spreadsheets",
        ]);

        const sheets = google.sheets({ version: "v4", auth });

        const values = [[name, email, kids, greeting, status]];
        const resource = { values };

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: "Sheet1!A:E",
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource,
        });

        return new Response(JSON.stringify({ message: "Data added successfully" }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to write data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
