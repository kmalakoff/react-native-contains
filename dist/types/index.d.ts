export interface NativeElement extends Element {
    _nativeTag: number;
    _children: NativeElement[];
}
export default function contains(element: Element | HTMLElement | NativeElement, target: Element | HTMLElement | NativeElement | number): boolean;
