import { render } from '@testing-library/react';
import { createInertiaApp } from '@inertiajs/react'


const customRender = (ui, options) => {
  return render(
    <InertiaApp initialPage={/* mock initial page data */}>
      {ui}
    </InertiaApp>,
    options
  );
};

export * from '@testing-library/react';
export { customRender as render };
