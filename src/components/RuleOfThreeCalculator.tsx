import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Calculator, RotateCcw, ArrowRight, Lightbulb, AlertTriangle } from 'lucide-react';
import LiquidGlassShader from './LiquidGlassShader';

interface BackgroundMedia {
  url: string;
  type: 'image' | 'video';
  blurhash?: string;
}

interface ShaderParams {
  width: number;
  height: number;
  mouseX: number;
  mouseY: number;
  tintR: number;
  tintG: number;
  tintB: number;
  saturation: number;
  distortion: number;
  blur: number;
  text: string;
  iconSize: number;
  iconColorR: number;
  iconColorG: number;
  iconColorB: number;
  glassMode: 'light' | 'dark';
  shadowIntensity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  cornerRadius: number;
  chromaticAberration: number;
  shape: 'rectangle' | 'circle' | 'star' | 'hexagon' | 'donut';
  donutThickness: number;
  starPoints: number;
  starInnerRadius: number;
}

const BACKGROUND_IMAGE: BackgroundMedia = {
  url: 'https://images.unsplash.com/photo-1733944698566-1d222ca3e2c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbWF0aGVtYXRpY3MlMjBwYXR0ZXJuJTIwZ2VvbWV0cmljfGVufDF8fHx8MTc1ODUwMDg2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  type: 'image',
  blurhash: 'L04_lE00~q%M?bof%LWB00M{WBay'
};

export default function RuleOfThreeCalculator() {
  const [valueA, setValueA] = useState<string>('');
  const [valueB, setValueB] = useState<string>('');
  const [valueC, setValueC] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [examples] = useState([
    { a: '10', b: '20', c: '15', description: 'Proporção simples' },
    { a: '100', b: '5', c: '200', description: 'Velocidade e tempo' },
    { a: '3', b: '12', c: '7', description: 'Receita culinária' }
  ]);

  // Glass shader parameters for dark theme
  const glassParams: ShaderParams = {
    width: 480,
    height: 600,
    mouseX: 240, // Centro fixo
    mouseY: 300, // Centro fixo
    tintR: 0.1,
    tintG: 0.2,
    tintB: 0.4,
    saturation: 1.0,
    distortion: 3.0,
    blur: 2.0,
    text: '',
    iconSize: 0.0,
    iconColorR: 0.0,
    iconColorG: 0.0,
    iconColorB: 0.0,
    glassMode: 'dark',
    shadowIntensity: 0.6,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 20,
    cornerRadius: 16,
    chromaticAberration: 2.0,
    shape: 'rectangle',
    donutThickness: 0.3,
    starPoints: 5,
    starInnerRadius: 0.4
  };

  // Calculate rule of three: A/B = C/X, so X = (B * C) / A
  const calculateRuleOfThree = () => {
    setError('');
    
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
      setError('Por favor, insira apenas números válidos');
      setResult(null);
      return;
    }

    // Check for zero division
    if (a === 0) {
      setError('O valor A não pode ser zero (divisão por zero)');
      setResult(null);
      return;
    }

    const x = (b * c) / a;
    
    // Check for invalid result
    if (!isFinite(x)) {
      setError('Resultado inválido');
      setResult(null);
      return;
    }

    setResult(x);
  };

  // Auto-calculate when values change
  useEffect(() => {
    calculateRuleOfThree();
  }, [valueA, valueB, valueC]);

  const clearAll = () => {
    setValueA('');
    setValueB('');
    setValueC('');
    setResult(null);
    setError('');
  };

  const loadExample = (example: typeof examples[0]) => {
    setValueA(example.a);
    setValueB(example.b);
    setValueC(example.c);
  };



  const isValidCalculation = result !== null && !isNaN(result) && isFinite(result);

  return (
    <div className="min-h-screen bg-gray-900 dark relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Card with glass effect */}
        <div className="relative w-full max-w-md mx-auto">
          {/* Glass effect background */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <LiquidGlassShader
              backgroundMedia={BACKGROUND_IMAGE}
              uniforms={glassParams}
              className="w-full h-full"
            />
          </div>
          
          {/* Content overlay */}
          <Card className="relative bg-gray-900/20 backdrop-blur-sm border-gray-600/50 shadow-2xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-600/30 rounded-lg backdrop-blur-sm">
                <Calculator className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white drop-shadow-lg">Regra de Três</h1>
                <p className="text-sm text-gray-300 drop-shadow-md">Calculadora de proporção simples</p>
              </div>
            </div>

            {/* Rule explanation */}
            <div className="mb-6 p-4 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-600/50">
              <p className="text-sm text-gray-200 text-center mb-2 drop-shadow-md">
                Se <span className="text-blue-300 font-mono">A</span> está para{' '}
                <span className="text-green-300 font-mono">B</span>, então{' '}
                <span className="text-purple-300 font-mono">C</span> está para{' '}
                <span className="text-orange-300 font-mono">X</span>
              </p>
              <div className="text-center text-gray-300 font-mono text-xs drop-shadow-md">
                A / B = C / X
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              {/* First proportion */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <div>
                  <Label htmlFor="valueA" className="text-sm text-blue-300 drop-shadow-md">A</Label>
                  <Input
                    id="valueA"
                    type="number"
                    placeholder="10"
                    value={valueA}
                    onChange={(e) => setValueA(e.target.value)}
                    className="bg-gray-900/70 backdrop-blur-sm border-gray-500/50 text-white placeholder-gray-400 focus:border-blue-400"
                  />
                </div>
                <div className="text-center text-gray-300 text-lg drop-shadow-md">:</div>
                <div>
                  <Label htmlFor="valueB" className="text-sm text-green-300 drop-shadow-md">B</Label>
                  <Input
                    id="valueB"
                    type="number"
                    placeholder="20"
                    value={valueB}
                    onChange={(e) => setValueB(e.target.value)}
                    className="bg-gray-900/70 backdrop-blur-sm border-gray-500/50 text-white placeholder-gray-400 focus:border-green-400"
                  />
                </div>
              </div>

              {/* Equals sign */}
              <div className="flex justify-center">
                <div className="bg-gray-900/70 backdrop-blur-sm rounded-full p-2 border border-gray-600/50">
                  <ArrowRight className="w-4 h-4 text-gray-300 rotate-90 drop-shadow-md" />
                </div>
              </div>

              {/* Second proportion */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <div>
                  <Label htmlFor="valueC" className="text-sm text-purple-300 drop-shadow-md">C</Label>
                  <Input
                    id="valueC"
                    type="number"
                    placeholder="15"
                    value={valueC}
                    onChange={(e) => setValueC(e.target.value)}
                    className="bg-gray-900/70 backdrop-blur-sm border-gray-500/50 text-white placeholder-gray-400 focus:border-purple-400"
                  />
                </div>
                <div className="text-center text-gray-300 text-lg drop-shadow-md">:</div>
                <div>
                  <Label className="text-sm text-orange-300 drop-shadow-md">X</Label>
                  <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-500/50 rounded-md px-3 py-2 min-h-[40px] flex items-center">
                    {isValidCalculation ? (
                      <span className="text-orange-300 font-mono drop-shadow-md">
                        {result.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-400 drop-shadow-md">?</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-gray-500/50" />

            {/* Error message */}
            {error && (
              <Alert className="mb-4 bg-red-900/40 backdrop-blur-sm border-red-500/50 text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="drop-shadow-md">{error}</AlertDescription>
              </Alert>
            )}

            {/* Result section */}
            {isValidCalculation && (
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-600/20 to-orange-600/20 backdrop-blur-sm rounded-lg border border-blue-500/30">
                <div className="text-center">
                  <p className="text-sm text-gray-200 mb-1 drop-shadow-md">Resultado</p>
                  <p className="text-2xl font-mono text-orange-300 drop-shadow-lg">{result.toFixed(4)}</p>
                  <p className="text-xs text-gray-300 mt-2 drop-shadow-md">
                    {valueA} ÷ {valueB} = {valueC} ÷ {result.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Examples section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-400 drop-shadow-md" />
                <span className="text-sm text-gray-200 drop-shadow-md">Exemplos</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => loadExample(example)}
                    className="p-2 bg-gray-900/60 hover:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-600/50 text-left transition-colors"
                  >
                    <div className="text-xs text-gray-300 mb-1 drop-shadow-md">{example.description}</div>
                    <div className="text-sm text-gray-200 font-mono drop-shadow-md">
                      {example.a} : {example.b} = {example.c} : ?
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                onClick={clearAll}
                variant="outline"
                className="flex-1 bg-gray-900/70 backdrop-blur-sm border-gray-500/50 text-gray-200 hover:bg-gray-800/70 hover:text-white drop-shadow-md"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>

            {/* Formula explanation */}
            <div className="mt-6 p-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-600/30">
              <p className="text-xs text-gray-300 text-center drop-shadow-md">
                <span className="font-mono">X = (B × C) ÷ A</span>
              </p>
              {isValidCalculation && (
                <p className="text-xs text-gray-400 text-center mt-1 drop-shadow-md">
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