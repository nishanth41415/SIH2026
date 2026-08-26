import React, { useState } from 'react';
import { VerificationRequest } from '../../types/verification';
import { Button, Card, Badge } from '../ui/Primitives';
import { KeyRound, Shield, Zap, Sparkles, Sliders } from 'lucide-react';

interface VerificationFormProps {
  onVerify: (req: VerificationRequest) => void;
  isProcessing: boolean;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  onVerify,
  isProcessing
}) => {
  const [signatureId, setSignatureId] = useState('SIG-QDS-2026-9941');
  const [signerId, setSignerId] = useState('AUTH_QUANTUM_CORE_ALICE');
  const [messageHash, setMessageHash] = useState('0x4e8b1a9f3d2c70e5b1a8f6c4d9e2b7a1');
  const [shots, setShots] = useState(10000);
  const [threshold, setThreshold] = useState(0.050);
  const [simulatedAttack, setSimulatedAttack] = useState<string>('NONE');

  const presets = [
    {
      label: 'Legitimate Alice Signature',
      sig: 'SIG-AUTH-ALICE-01',
      signer: 'AUTH_QUANTUM_CORE_ALICE',
      hash: '0x88f219c0b431e7d829aa7c88b901ec44',
      attack: 'NONE'
    },
    {
      label: 'Tampered Signature (State Forgery)',
      sig: 'SIG-FORGED-089',
      signer: 'UNVERIFIED_PROXY_NODE',
      hash: '0xdeadbeef11223344556677889900aabb',
      attack: 'FORGERY'
    },
    {
      label: 'Replay Telemetry Attack',
      sig: 'SIG-REPLAY-992',
      signer: 'NODE_ROGUE_7X',
      hash: '0x3d9f1a8e2b7c4d5e6f0a1b2c3d4e5f6a',
      attack: 'REPLAY'
    },
    {
      label: 'Decohered Quantum Channel',
      sig: 'SIG-NOISE-404',
      signer: 'REMOTE_OPTICAL_LINK_3',
      hash: '0x55aa12fe8890bbcc1122334455667788',
      attack: 'CHANNEL_MANIPULATION'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setSignatureId(p.sig);
    setSignerId(p.signer);
    setMessageHash(p.hash);
    setSimulatedAttack(p.attack);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req: VerificationRequest = {
      signatureId,
      signerId,
      messageHash,
      measurementShots: shots,
      securityThreshold: threshold,
      bellState: 'PHI_PLUS',
      attackInjection: simulatedAttack !== 'NONE' ? {
        type: simulatedAttack as any,
        intensity: 80,
        noiseLevel: simulatedAttack === 'CHANNEL_MANIPULATION' ? 45 : 10
      } : undefined
    };
    onVerify(req);
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-700/60">
            <KeyRound className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-mono">
              Verification Session Parameters
            </h3>
            <p className="text-[11px] text-slate-400">
              Configure quantum teleportation telemetry and hypothesis test bounds
            </p>
          </div>
        </div>

        <Badge variant={simulatedAttack === 'NONE' ? 'success' : 'danger'}>
          {simulatedAttack === 'NONE' ? 'AUTHENTIC VECTOR' : `ATTACK INJECTED: ${simulatedAttack}`}
        </Badge>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="text-[11px] font-mono text-slate-400 block mb-2 font-semibold uppercase">
          Quick Verification Presets:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/60 text-left text-xs transition-colors cursor-pointer"
            >
              <div className="font-medium text-slate-200 truncate">{p.label}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{p.signer}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Form Input fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1.5">
              Signature ID
            </label>
            <input
              type="text"
              value={signatureId}
              onChange={e => setSignatureId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/80"
              required
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1.5">
              Signer Authority ID
            </label>
            <input
              type="text"
              value={signerId}
              onChange={e => setSignerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1.5">
            Payload Message Digest (SHA-256 / Quantum Token Seed)
          </label>
          <input
            type="text"
            value={messageHash}
            onChange={e => setMessageHash(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-cyan-500/80"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span>Measurement Shots (N)</span>
              <span className="text-cyan-400 font-bold">{shots.toLocaleString()}</span>
            </div>
            <select
              value={shots}
              onChange={e => setShots(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80"
            >
              <option value={1000}>1,000 Shots (Rapid)</option>
              <option value={5000}>5,000 Shots</option>
              <option value={10000}>10,000 Shots (Standard)</option>
              <option value={25000}>25,000 Shots (High Precision)</option>
              <option value={50000}>50,000 Shots (Cryptographic Grade)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span>Security Threshold (τ)</span>
              <span className="text-amber-300 font-bold">{threshold.toFixed(3)} TVD</span>
            </div>
            <select
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80"
            >
              <option value={0.020}>0.020 (Strict / Low False Negatives)</option>
              <option value={0.035}>0.035 (Sensitive)</option>
              <option value={0.050}>0.050 (Recommended Baseline)</option>
              <option value={0.080}>0.080 (Tolerant to Optical Loss)</option>
              <option value={0.100}>0.100 (Loose)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isProcessing}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-2" />
                <span>EXECUTING TELEPORTATION PIPELINE...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-1 text-slate-950" />
                <span>VERIFY QUANTUM SIGNATURE</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
