<Routes>

        <Route path="/onboarding" caseSensitive={false} element={<Onboarding pageState="initial" />} />
        <Route path="/" caseSensitive={false} element={<HomePage />} />
        <Route path="/files" caseSensitive={false} element={<HomePage selectedTab={1} />} />
        
        <Route path="/qr-codes" caseSensitive={false} element={<HomePage selectedTab={2} />} />
        <Route path="/emails" caseSensitive={false} element={<HomePage selectedTab={3} />} />
        <Route path="/settings" caseSensitive={false} element={<HomePage selectedTab={4} />} />
       
        <Route path="/help" caseSensitive={false} element={<HomePage selectedTab={5} />} />

        
        
        
      </Routes>  