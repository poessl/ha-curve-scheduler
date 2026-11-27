# Offset behavior contract

- Raw curve value is the existing bounded, rounded setpoint before the additive
  adjustment. Its stable entity ID and unique ID remain unchanged. The existing
  `raw_value` attribute still reports unrounded interpolation.
- Curve value adds the stored offset to Raw curve value, clamps to the configured
  output range, rounds to the configured step, and clamps again. Target writes
  use Curve value. Offset uses output units and is never scaled between plans.
- Apply offset defaults to true per plan. A false flag bypasses the stored
  adjustment; it does not erase it. Selecting an opted-in plan applies it again.
- Watch target defaults to false. Turning watching off stops capture; it does
  not clear the stored adjustment. With no target there is nothing to watch,
  but adjusted sensors continue to work.
- Watching captures external changes only while the curve is enabled and the
  target and curve input are valid. The offset is replaced by the new target
  value minus the Raw curve value calculated at the event, including when the
  active plan bypasses offset application. Recovery from unavailable state and
  unrelated attributes do not create adjustments.
- Numeric targets use their numeric state. Climate and water heater targets use
  the writable temperature attribute, not their operating state or measured
  temperature.
- Writes carry HA context IDs. Updates with those IDs or their parent IDs are
  ignored, including delayed acknowledgments. Exact last-written values are
  also ignored for targets that do not propagate context. Devices which drop
  context and acknowledge a different rounded value cannot be reliably
  distinguished from an external adjustment; configure compatible output steps.
- Offset survives schedule edits, plan changes, disabling, option reloads and
  restarts. Startup uses the stored offset; changes made while HA was offline
  are not retrospectively captured. Changing the target retains the offset.
- A whole-curve clone includes the stored offset and plan flags, and starts
  disabled. Its subsequent offset changes are independent of the original.
- Clear offset persists zero, publishes the sensors, and applies the current
  value immediately when enabled and available. The reset write is identified
  as the integration's own write and is not captured again.
