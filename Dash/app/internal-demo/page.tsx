// This page acts as an internal target for the /demo rewrite.
// It imports and renders the actual demo component from the root demo directory.

import DemoPage from '../../demo/implementation'; // Adjust path as needed

export default function InternalDemoPage() {
  return <DemoPage />;
}