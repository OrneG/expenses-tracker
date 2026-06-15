"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { CURRENCIES, getNextCurrency, parseAmount } from "@/lib/currency";
import type { Currency } from "@/lib/currency";
import { extractTotalAmount } from "@/lib/receipt";
import { useExpenses } from "@/context/ExpenseContext";

const MAX_RECEIPT_IMAGE_SIZE_MB = 8;
const MAX_RECEIPT_IMAGE_SIZE_BYTES = MAX_RECEIPT_IMAGE_SIZE_MB * 1024 * 1024;

export default function ExpenseForm() {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.ARS);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [ocrStatus, setOcrStatus] = useState("");
  const [receiptText, setReceiptText] = useState("");
  const { addExpense } = useExpenses();

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!imageFile) {
      setOcrStatus("");
      setReceiptText("");
      return;
    }

    const currentImageFile = imageFile;
    let isActive = true;

    async function extractReceiptText() {
      setOcrStatus("Extracting text...");
      setReceiptText("");

      try {
        const { createWorker } = await import("tesseract.js");
        const worker = await createWorker(["spa", "eng"]);
        const {
          data: { text },
        } = await worker.recognize(currentImageFile);

        await worker.terminate();

        if (isActive) {
          const trimmedText = text.trim();
          setReceiptText(trimmedText);
          setOcrStatus(
            trimmedText ? "Text extracted." : "No text was detected.",
          );
        }
      } catch {
        if (isActive) {
          setOcrStatus("Could not extract text from this image.");
        }
      }
    }

    extractReceiptText();

    return () => {
      isActive = false;
    };
  }, [imageFile]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const trimmedName = String(formData.get("expenseName") ?? "").trim();
    const trimmedAmount = String(formData.get("expenseAmount") ?? "").trim();
    const currentReceiptText = String(formData.get("receiptText") ?? "");
    const numericAmount = trimmedAmount
      ? parseAmount(trimmedAmount, currency)
      : extractTotalAmount(currentReceiptText, currency);

    if (!trimmedName) {
      setError("Add a name for this expense.");
      return;
    }

    if (
      numericAmount === null ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        currentReceiptText
          ? "Enter an amount or make sure the receipt text includes a TOTAL line."
          : "Enter an amount greater than 0.",
      );
      return;
    }

    addExpense({
      name: trimmedName,
      amount: numericAmount,
      currency,
    });

    event.currentTarget.reset();
    setImageFile(null);
    setImageInputKey((currentKey) => currentKey + 1);
    setReceiptText("");
    setOcrStatus("");
    setError("");
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setImageFile(null);
      return;
    }

    if (
      !selectedFile.type.startsWith("image/") ||
      selectedFile.type === "image/svg+xml"
    ) {
      setError("Upload a receipt image file.");
      setImageFile(null);
      return;
    }

    if (selectedFile.size > MAX_RECEIPT_IMAGE_SIZE_BYTES) {
      setError(`Receipt image must be ${MAX_RECEIPT_IMAGE_SIZE_MB} MB or less.`);
      setImageFile(null);
      return;
    }

    setError("");
    setImageFile(selectedFile);
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="expense-name">Expense name</label>
        <input
          id="expense-name"
          name="expenseName"
          type="text"
          placeholder="Coffee, groceries, rent"
          autoComplete="off"
        />
      </div>

      <div className="field-group">
        <label htmlFor="expense-amount">Amount</label>
        <div className="amount-input">
          <button
            type="button"
            className="amount-currency-button"
            onClick={() => setCurrency(getNextCurrency(currency))}
            aria-label={`Change expense currency from ${currency}`}
          >
            {currency}
          </button>
          <input
            id="expense-amount"
            name="expenseAmount"
            type="text"
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
      </div>

      <div className="field-group receipt-upload">
        <label>Receipt photo</label>
        <div className="receipt-actions">
          <label className="file-action" htmlFor="expense-camera">
            Take photo
          </label>
          <label className="file-action secondary" htmlFor="expense-image">
            Choose image
          </label>
        </div>
        <input
          key={`camera-${imageInputKey}`}
          id="expense-camera"
          className="file-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
        />
        <input
          key={`image-${imageInputKey}`}
          id="expense-image"
          className="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreviewUrl ? (
          <div className="image-preview">
            <img src={imagePreviewUrl} alt="Selected receipt preview" />
          </div>
        ) : null}
        {ocrStatus ? <p className="ocr-status">{ocrStatus}</p> : null}
        {imagePreviewUrl ? (
          <textarea
            className="receipt-textarea"
            name="receiptText"
            value={receiptText}
            onChange={(event) => setReceiptText(event.currentTarget.value)}
            placeholder="Extracted receipt text will appear here."
            rows={6}
          />
        ) : null}
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <button type="submit">Add expense</button>
    </form>
  );
}
