import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { sizeGuide } from '@/data/products';
import { Ruler } from 'lucide-react';

interface SizeGuideProps {
  trigger?: React.ReactNode;
}

const SizeGuide = ({ trigger }: SizeGuideProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-2 text-mono text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            <Ruler size={14} />
            SIZE GUIDE
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-background border-border">
        <DialogHeader>
          <DialogTitle className="heading-product text-lg">SIZE GUIDE</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Size Table */}
          <div className="border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-mono text-xs text-left py-3 px-4">SIZE</th>
                  <th className="text-mono text-xs text-center py-3 px-4">CHEST</th>
                  <th className="text-mono text-xs text-center py-3 px-4">LENGTH</th>
                  <th className="text-mono text-xs text-center py-3 px-4">SHOULDER</th>
                </tr>
              </thead>
              <tbody>
                {sizeGuide.measurements.map((row, index) => (
                  <tr 
                    key={row.size} 
                    className={index !== sizeGuide.measurements.length - 1 ? 'border-b border-border' : ''}
                  >
                    <td className="text-mono text-sm font-medium py-3 px-4">{row.size}</td>
                    <td className="text-mono text-sm text-center text-muted-foreground py-3 px-4">{row.chest}</td>
                    <td className="text-mono text-sm text-center text-muted-foreground py-3 px-4">{row.length}</td>
                    <td className="text-mono text-sm text-center text-muted-foreground py-3 px-4">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Unit indicator */}
          <p className="text-mono text-[10px] text-muted-foreground text-right">
            All measurements in {sizeGuide.unit.toUpperCase()}
          </p>

          {/* Notes */}
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-mono text-xs text-muted-foreground mb-2">NOTES</p>
            <ul className="space-y-1.5">
              {sizeGuide.notes.map((note, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-foreground/50">—</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {/* How to Measure */}
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-mono text-xs text-muted-foreground">HOW TO MEASURE</p>
            <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Chest</p>
                <p>Measure under arms around fullest part</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Length</p>
                <p>From shoulder seam to bottom hem</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Shoulder</p>
                <p>Seam to seam across back</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
