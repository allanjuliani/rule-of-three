import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Calculator,
  RotateCcw,
  ArrowRight,
  History,
  AlertTriangle,
} from "lucide-react";

interface HistoryEntry {
  id: string;
  a: string;
  b: string;
  c: string;
  result: number;
  timestamp: Date;
  description?: string;
}

const BACKGROUND_IMAGE =
  "bg.png";

export default function RuleOfThreeCalculator() {
  const [valueA, setValueA] = useState<string>("");
  const [valueB, setValueB] = useState<string>("");
  const [valueC, setValueC] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("ruleOfThreeHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const historyWithDates = parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setHistory(historyWithDates);
      } catch (error) {
        console.error("Error loading history:", error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ruleOfThreeHistory", JSON.stringify(history));
  }, [history]);

  // Save calculation to history
  const saveToHistory = (calculatedResult: number) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      a: valueA,
      b: valueB,
      c: valueC,
      result: calculatedResult,
      timestamp: new Date(),
    };

    setHistory((prev) => [newEntry, ...prev.slice(0, 9)]); // Keep only 10 most recent
  };

  // Calculate rule of three: A/B = C/X, so X = (B * C) / A
  const calculateRuleOfThree = () => {
    setError("");

    const a = parseFloat(valueA);
    const b = parseFloat(valueB);
    const c = parseFloat(valueC);

    // Check for empty values
    if (!valueA || !valueB || !valueC) {
      setResult(null);
      return;
    }

    // Check for invalid numbers
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setError("Por favor, insira apenas números válidos");
      setResult(null);
      return;
    }

    // Check for zero division
    if (a === 0) {
      setError("O valor A não pode ser zero (divisão por zero)");
      setResult(null);
      return;
    }

    const x = (b * c) / a;

    // Check for invalid result
    if (!isFinite(x)) {
      setError("Resultado inválido");
      setResult(null);
      return;
    }

    setResult(x);

    // Save valid calculations to history
    if (valueA && valueB && valueC) {
      saveToHistory(x);
    }
  };

  // Auto-calculate when values change
  useEffect(() => {
    calculateRuleOfThree();
  }, [valueA, valueB, valueC]);

  const clearAll = () => {
    setValueA("");
    setValueB("");
    setValueC("");
    setResult(null);
    setError("");
    // Clear history as well
    setHistory([]);
    localStorage.removeItem("ruleOfThreeHistory");
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setValueA(entry.a);
    setValueB(entry.b);
    setValueC(entry.c);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isValidCalculation =
    result !== null && !isNaN(result) && isFinite(result);

  return (
    <div className="min-h-screen dark relative overflow-hidden">
      {/* Fixed NASA background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${BACKGROUND_IMAGE}')`,
        }}
      />

      {/* Dark overlay for better contrast */}
      <div className="fixed inset-0 bg-black/60" />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Card with glass effect */}
        <div className="relative w-full max-w-md mx-auto">
          {/* Content overlay */}
          <Card className="relative bg-black/30 backdrop-blur-md border-white/20 shadow-2xl backdrop-saturate-150">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/40 rounded-lg backdrop-blur-sm border border-blue-400/30">
                  <Calculator className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white drop-shadow-xl">
                    Regra de Três
                  </h1>
                  <p className="text-sm text-gray-200 drop-shadow-lg">
                    Calculadora de proporção simples
                  </p>
                </div>
              </div>

              {/* Rule explanation */}
              <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-sm text-white text-center mb-2 drop-shadow-lg">
                  Se <span className="text-blue-200 font-mono">A</span> está
                  para <span className="text-green-200 font-mono">B</span>,
                  então <span className="text-purple-200 font-mono">C</span>{" "}
                  está para <span className="text-orange-200 font-mono">X</span>
                </p>
                <div className="text-center text-gray-200 font-mono text-xs drop-shadow-lg">
                  A / B = C / X
                </div>
              </div>

              {/* Input fields */}
              <div className="space-y-4">
                {/* First proportion */}
                <div className="grid grid-cols-3 gap-3 items-center">
                  <div>
                    <Label
                      htmlFor="valueA"
                      className="text-sm text-blue-200 drop-shadow-lg"
                    >
                      A
                    </Label>
                    <Input
                      id="valueA"
                      type="number"
                      placeholder="10"
                      value={valueA}
                      onChange={(e) => setValueA(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-gray-300 focus:border-blue-300 h-12"
                    />
                  </div>
                  <div className="text-center text-gray-200 text-lg drop-shadow-lg">
                    :
                  </div>
                  <div>
                    <Label
                      htmlFor="valueB"
                      className="text-sm text-green-200 drop-shadow-lg"
                    >
                      B
                    </Label>
                    <Input
                      id="valueB"
                      type="number"
                      placeholder="20"
                      value={valueB}
                      onChange={(e) => setValueB(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-gray-300 focus:border-green-300 h-12"
                    />
                  </div>
                </div>

                {/* Equals sign */}
                <div className="flex justify-center">
                  <div className="bg-white/15 backdrop-blur-sm rounded-full p-2 border border-white/30">
                    <ArrowRight className="w-4 h-4 text-gray-200 rotate-90 drop-shadow-lg" />
                  </div>
                </div>

                {/* Second proportion */}
                <div className="grid grid-cols-3 gap-3 items-center">
                  <div>
                    <Label
                      htmlFor="valueC"
                      className="text-sm text-purple-200 drop-shadow-lg"
                    >
                      C
                    </Label>
                    <Input
                      id="valueC"
                      type="number"
                      placeholder="15"
                      value={valueC}
                      onChange={(e) => setValueC(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-gray-300 focus:border-purple-300 h-12"
                    />
                  </div>
                  <div className="text-center text-gray-200 text-lg drop-shadow-lg">
                    :
                  </div>
                  <div>
                    <Label className="text-sm text-orange-200 drop-shadow-lg">
                      X
                    </Label>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-md px-3 py-2 min-h-[48px] flex items-center">
                      {isValidCalculation ? (
                        <span className="text-orange-200 font-mono drop-shadow-lg">
                          {result.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-300 drop-shadow-lg">?</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-white/30" />

              {/* Error message */}
              {error && (
                <Alert className="mb-4 bg-red-500/20 backdrop-blur-sm border-red-400/40 text-red-100">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="drop-shadow-lg">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Result section */}
              {isValidCalculation && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg border border-white/30">
                  <div className="text-center">
                    <p className="text-sm text-white mb-1 drop-shadow-lg">
                      Resultado
                    </p>
                    <p className="text-2xl font-mono text-orange-200 drop-shadow-xl">
                      {result.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-200 mt-2 drop-shadow-lg">
                      {valueA} ÷ {valueB} = {valueC} ÷ {result.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* History section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-blue-300 drop-shadow-lg" />
                  <span className="text-sm text-white drop-shadow-lg">
                    Histórico
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="p-3 text-center text-gray-400 text-sm">
                      Nenhum cálculo realizado ainda
                    </div>
                  ) : (
                    history.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => loadHistoryEntry(entry)}
                        className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-left transition-colors"
                      >
                        <div className="text-xs text-gray-300 mb-1 drop-shadow-lg">
                          {formatDate(entry.timestamp)}
                        </div>
                        <div className="text-sm text-white font-mono drop-shadow-lg">
                          {entry.a} : {entry.b} = {entry.c} :{" "}
                          {entry.result.toFixed(2)}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="flex-1 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white drop-shadow-lg"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Limpar Tudo
                </Button>
              </div>

              {/* Formula explanation */}
              <div className="mt-6 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-xs text-gray-200 text-center drop-shadow-lg">
                  <span className="font-mono">X = (B × C) ÷ A</span>
                </p>
                {isValidCalculation && (
                  <p className="text-xs text-gray-300 text-center mt-1 drop-shadow-lg">
                    X = ({valueB} × {valueC}) ÷ {valueA} = {result.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
