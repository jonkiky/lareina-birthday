"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kids, setKids] = useState("1");
  const [greeting, setGreeting] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const openModal = (status: string) => {
    setRsvpStatus(status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRsvpStatus("");
    setName("");
    setEmail("");
    setKids("1");
    setGreeting("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      email,
      kids: rsvpStatus === "Yes" ? kids : "0",
      greeting,
      status: rsvpStatus,
    };

    try {
      const response = await fetch("/api/google-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage("Thank you! Excited to see you or catch up later!");
        fetchGuests();
      } else {
        alert("Failed to submit RSVP.");
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Failed to submit RSVP.");
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/google-sheet");
      const data = await response.json();
      setGuests(data.data.slice(1)); // Remove the header row
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 relative">
      <header className="flex flex-col sm:flex-row justify-between items-center py-4">
      </header>

      <main className="max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <Image
            src="/birthday-invite.gif"
            alt="Birthday Invitation"
            width={400}
            height={500}
            className="w-full max-w-xs sm:max-w-none"
          />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome to Lareina&apos;s 6th Birthday Party</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg flex-1">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">When</h2>
            <p>SUNDAY, APRIL 6, 2025</p>
            <p>2:30 PM  - 4:00 PM </p>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg flex-1">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Where</h2>
            <p>Dominique Dawes Gymnastics & Ninja Academy</p>
            <p>22530 Gateway Center Dr Suite 700 </p>
            <p>Clarksburg, MD 20871</p>
            <a href="https://www.google.com/maps?q=22530+Gateway+Center+Dr+Suite+700,+Clarksburg,+MD+20871" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View map</a>
          </div>
        </div>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Hosted by</h2>
          <p>Yizhen Chen (John), Lu Liu</p>
          <br />
          <p>
             Please plan to arrive by 2:30 PM for sign-in. We encourage kids to wear comfortable  clothing suitable for tumbling, jumping, and fun gymnastics activities. 
            <br />
            Get ready for flips, fun, and an exciting celebration! 
            <br />See you there!
          </p>
          <br />
            <p>Phone: <a href="tel:+5183605856" className="text-blue-500 hover:underline">(518) 360-5856</a></p> 
            <p>Email: <a href="mailto:lareina.kiky@gmail.com" className="text-blue-500 hover:underline">lareina.kiky@gmail.com</a></p>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Event Type</h2>
          <p>Jump, roll, and swing into an unforgettable birthday bash! Come celebrate with us as we flip into fun!</p>
          <br />
          <div className="flex justify-center">
            <Image
              src="/party-type.jpg"
              alt="Birthday Party"
              width={200}
              height={200}
              className="w-full max-w-xs sm:max-w-none"
            />
          </div>
        </div>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Greetings</h2>
          <div className="flex flex-wrap gap-4">
          {guests.map((guest, index) => (
            guest[3]  && guest[5] == "yes" && ( // Ensure guest[3] exists and guest[5] is strictly "Yes"
              <div key={index} className="bg-white p-4 rounded-lg shadow w-full">
                <p className="font-semibold">{guest[0]} : {guest[3]}</p>
              </div>
            )
          ))}

          </div>
        </div>
      </main>

      <footer className="text-center py-8 mb-24">
        <p className="text-gray-500">© 2025 Lareina Liu Chen. All Rights Reserved.</p>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-8 shadow-lg flex justify-center items-center shadow-lg">
        <p className="text-lg font-semibold mr-4">WILL YOU BE ATTENDING</p>
        <div className="flex gap-4">
          <button className="bg-black text-white px-4 py-2 rounded" onClick={() => openModal("Yes")}>YES</button>
          <button className="bg-black text-white px-4 py-2 rounded" onClick={() => openModal("No")}>NO</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-80 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            {successMessage ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">{successMessage}</h2>
                <button className="bg-black text-white px-4 py-2 rounded" onClick={closeModal}>Close</button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  {rsvpStatus === "Yes" ? (
                    <h2 className="text-xl font-semibold">Yay! Can&rsquo;t wait to celebrate with you!</h2>
                  ) : (
                    <h2 className="text-xl font-semibold">Sorry, We&rsquo;ll Miss You</h2>
                  )}
                  <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Your Name or Kids Nam * </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {rsvpStatus === "Yes" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">How many kid(s) would like to attend</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={kids}
                        onChange={(e) => setKids(e.target.value)}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Greeting</label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      rows={5}
                      placeholder="Enter your greeting"
                      value={greeting}
                      onChange={(e) => setGreeting(e.target.value)}
                    ></textarea>
                  </div>
                  <button type="submit" className="bg-black text-white px-4 py-2 rounded w-full">Submit RSVP</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
