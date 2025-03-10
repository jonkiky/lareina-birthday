"use client";

import { useEffect, useState } from "react";

export default function SheetData() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/api/google-sheet")
            .then((res) => res.json())
            .then((data) => setData(data.data));
    }, []);

    return (
        <div>
            <h1>Google Sheets Data</h1>
            <table border="1">
                <tbody>
                    {data?.map((row, index) => (
                        <tr key={index}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
