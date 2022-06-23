export interface NativeElement {
    _nativeTag: number;
    _children: NativeElement[];
}
export default function contains(element: HTMLElement | NativeElement, target: HTMLElement | NativeElement): boolean;
