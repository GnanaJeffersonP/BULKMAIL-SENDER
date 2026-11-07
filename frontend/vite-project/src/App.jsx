
import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [fileName, setFileName] = useState("");

  function handleChange(event) {
    setMsg(event.target.value);
}

  function handlefile(event) {
    const file = event.target.files[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: "A",
        defval: ""
      });

      const emails = rows
        .map((item) => String(item.A).trim())
        .filter((email) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        );

      setEmailList(emails);
    };

    reader.readAsArrayBuffer(file);
  }

 async function send() {
    if (!msg.trim()) {
        alert("Please enter your email message");
        return;
    }

    if (emailList.length === 0) {
        alert("Please upload a valid Excel email list");
        return;
    }

    setStatus(true);

    try {
        const response = await axios.post("http://localhost:3000/mail", {
            msg: msg,
            emailList: emailList
        });

        if (response.data === true) {
            alert("Email sent successfully!");
        } else {
            alert("Email sending failed");
        }

    } catch (error) {
        console.log(error);
        alert("Something went wrong!");
    } finally {
        setStatus(false);
    }
}

  return (
    <div className="min-h-screen bg-[#080F20] text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#0B1428]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
              ✉
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">
                Mail<span className="text-blue-400">Flow</span>
              </h1>
              <p className="text-xs text-gray-400">
                Bulk Email Management
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            System Ready
          </div>

        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-5 py-12">

        {/* Hero Section */}
        <div className="mb-10">

          <p className="text-blue-400 text-sm font-semibold uppercase tracking-[3px] mb-3">
            Email Campaign Dashboard
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Send emails.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              {" "}Reach everyone.
            </span>
          </h2>

          <p className="text-gray-400 max-w-xl leading-7">
            Create your email message, upload your recipient
            list and send your campaign with ease.
          </p>

        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          <div className="bg-[#111D35] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Total Recipients</p>
              <span className="text-2xl">👥</span>
            </div>

            <h3 className="text-3xl font-bold mt-4">
              {emailList.length}
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Valid email addresses
            </p>
          </div>

          <div className="bg-[#111D35] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Message Length</p>
              <span className="text-2xl">📝</span>
            </div>

            <h3 className="text-3xl font-bold mt-4">
              {msg.length}
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Characters written
            </p>
          </div>

          <div className="bg-[#111D35] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Campaign Status</p>
              <span className="text-2xl">🚀</span>
            </div>

            <h3 className="text-xl font-bold mt-5 text-green-400">
              {status ? "Sending..." : "Ready to Send"}
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              {status ? "Processing campaign" : "Waiting for campaign"}
            </p>
          </div>

        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Email Composer */}
          <div className="lg:col-span-3 bg-[#111D35] border border-white/10 rounded-2xl p-6 md:p-8">

            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">
                ✍️
              </div>

              <div>
                <h3 className="font-bold text-lg">Compose Email</h3>
                <p className="text-gray-400 text-xs">
                  Create your campaign message
                </p>
              </div>
            </div>

            <label className="text-sm text-gray-300 font-medium">
              Email Subject / Message
            </label>

            <textarea
              className="w-full h-64 mt-3 p-5 bg-[#0B1428] border border-white/10 rounded-xl outline-none resize-none text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              placeholder="Write your email message here..."
              value={msg}
              onChange={handleChange}
            />

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Write your campaign content</span>
              <span>{msg.length} characters</span>
            </div>

          </div>

          {/* Upload Section */}
          <div className="lg:col-span-2 bg-[#111D35] border border-white/10 rounded-2xl p-6 md:p-8">

            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-xl">
                📊
              </div>

              <div>
                <h3 className="font-bold text-lg">Recipients</h3>
                <p className="text-gray-400 text-xs">
                  Import your Excel file
                </p>
              </div>
            </div>

            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center text-center border-2 border-dashed border-blue-500/40 rounded-2xl p-8 min-h-64 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-400 transition cursor-pointer"
            >
              <div className="text-5xl mb-5">📂</div>

              <h4 className="font-semibold text-lg mb-2">
                Upload Excel File
              </h4>

              <p className="text-gray-400 text-sm mb-5">
                Click to browse your files
              </p>

              <span className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-sm font-semibold">
                Choose File
              </span>

              <p className="text-gray-500 text-xs mt-5">
                Supported formats: XLSX, XLS
              </p>

              <input
                onChange={handlefile}
                type="file"
                id="fileInput"
                accept=".xlsx,.xls"
                className="hidden"
              />
            </label>

            {fileName && (
              <div className="mt-5 bg-[#0B1428] rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {fileName}
                    </p>
                    <p className="text-xs text-green-400 mt-1">
                      {emailList.length} valid email addresses found
                    </p>
                  </div>

                  <span className="text-green-400">✓</span>
                </div>
              </div>
            )}

            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-sm text-blue-300 font-medium">
                💡 Excel Format
              </p>
              <p className="text-xs text-gray-400 mt-2 leading-5">
                Place email addresses in the first column
                of your Excel spreadsheet.
              </p>
            </div>

          </div>

        </div>

        {/* Send Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">

          <div>
            <h3 className="font-bold text-xl">
              Ready to launch your campaign?
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Your message will be sent to {emailList.length} recipients.
            </p>
          </div>

          <button
            onClick={send}
            disabled={status}
            className="w-full md:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 font-bold shadow-lg shadow-blue-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status ? "Sending..." : "🚀 Send Campaign"}
          </button>

        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-xs mt-12 pb-5">
          © 2026 MailFlow. Bulk Email Management System.
        </footer>

      </main>

    </div>
  );
}

export default App;
