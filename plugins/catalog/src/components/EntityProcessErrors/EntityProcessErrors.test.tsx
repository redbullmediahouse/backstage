/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { EntityProvider } from '@backstage/plugin-catalog-react';

import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { EntityProcessErrors } from './EntityProcessErrors';
import { Entity } from '@backstage/catalog-model';
import { waitFor } from '@testing-library/react';

describe('<EntityProcessErrors />', () => {
  it('renders EntityProcessErrors if the entity has errors', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
      },

      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
      status: {
        items: [
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message:
              'InputError: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
            error: {
              name: 'InputError',
              message:
                'Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
          {
            type: 'backstage.io/catalog-processing',
            level: 'error',
            message: 'InputError: Foo',
            error: {
              name: 'InputError',
              message: 'Foo',
              cause: {
                name: 'Error',
                message:
                  'Malformed envelope, /metadata/labels should be object',
              },
            },
          },
        ],
      },
    };

    const { getByText } = await renderInTestApp(
      <EntityProvider entity={entity}>
        <EntityProcessErrors />
      </EntityProvider>,
    );

    await waitFor(() => {
      expect(
        getByText(
          'Error: Policy check failed; caused by Error: Malformed envelope, /metadata/labels should be object',
        ),
      ).toBeInTheDocument();
      expect(getByText('Error: Foo')).toBeInTheDocument();
    });
  });
});
